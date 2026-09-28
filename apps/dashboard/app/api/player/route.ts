import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireAuth('SUPPORT');
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const citizenId = searchParams.get('citizenId');
    const license = searchParams.get('license');

    if (citizenId) {
      const character = await prisma.character.findUnique({
        where: { citizenId },
        include: {
          user: { select: { discordId: true, username: true, avatar: true } },
          vehicles: true,
          inventory: true,
        },
      });
      return NextResponse.json({ character });
    }

    if (license) {
      const characters = await prisma.character.findMany({
        where: { license },
        include: {
          user: { select: { discordId: true, username: true } },
        },
      });
      return NextResponse.json({ characters });
    }

    if (q) {
      const characters = await prisma.character.findMany({
        where: {
          OR: [
            { firstName: { contains: q } },
            { lastName: { contains: q } },
            { citizenId: { contains: q } },
            { steamHex: { contains: q } },
            { license: { contains: q } },
          ],
        },
        take: 20,
        include: {
          user: { select: { discordId: true, username: true } },
        },
      });
      return NextResponse.json({ characters });
    }

    const characters = await prisma.character.findMany({
      take: 50,
      orderBy: { updatedAt: 'desc' },
      include: {
        user: { select: { discordId: true, username: true } },
      },
    });

    return NextResponse.json({ characters });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ error: msg }, { status: msg === 'Unauthorized' ? 401 : 500 });
  }
}
