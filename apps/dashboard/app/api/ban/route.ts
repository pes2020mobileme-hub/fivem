import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const createBanSchema = z.object({
  targetName: z.string().optional(),
  identifiers: z.array(z.string()).min(1),
  reason: z.string().min(3),
  type: z.enum(['TEMPORARY', 'PERMANENT', 'GLOBAL']).default('PERMANENT'),
  expiresAt: z.string().datetime().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await requireAuth('MODERATOR');
    const { searchParams } = new URL(req.url);
    const active = searchParams.get('active');

    const bans = await prisma.ban.findMany({
      where: active === 'true' ? { isActive: true } : undefined,
      include: { bannedBy: { select: { username: true, discordId: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ bans });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ error: msg }, { status: msg === 'Unauthorized' ? 401 : 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth('MODERATOR');
    const body = await req.json();
    const parsed = createBanSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const ban = await prisma.ban.create({
      data: {
        targetName: parsed.data.targetName,
        identifiers: parsed.data.identifiers,
        reason: parsed.data.reason,
        type: parsed.data.type,
        expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
        bannedById: session.userId,
      },
    });

    await prisma.log.create({
      data: {
        userId: session.userId,
        type: 'BAN',
        action: 'CREATE_BAN',
        details: { banId: ban.id, reason: ban.reason, type: ban.type },
      },
    });

    return NextResponse.json({ ban }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ error: msg }, { status: msg === 'Unauthorized' ? 401 : 500 });
  }
}
