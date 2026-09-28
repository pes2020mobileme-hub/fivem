import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const actionSchema = z.object({
  characterId: z.string(),
  action: z.enum(['ADD', 'REMOVE', 'TRANSFER', 'RESET']),
  balanceType: z.enum(['CASH', 'BANK', 'BLACK_MONEY', 'CRYPTO']),
  amount: z.number().positive().optional(),
  reason: z.string().optional(),
  targetCharacterId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await requireAuth('MODERATOR');
    const characterId = req.nextUrl.searchParams.get('characterId');
    if (!characterId) {
      return NextResponse.json({ error: 'characterId required' }, { status: 400 });
    }

    const character = await prisma.character.findUnique({
      where: { id: characterId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        cash: true,
        bank: true,
        blackMoney: true,
        crypto: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    });

    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    return NextResponse.json({ character });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ error: msg }, { status: msg === 'Unauthorized' ? 401 : 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth('MODERATOR');
    const body = await req.json();
    const parsed = actionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { characterId, action, balanceType, amount, reason, targetCharacterId } = parsed.data;

    const fieldMap = {
      CASH: 'cash',
      BANK: 'bank',
      BLACK_MONEY: 'blackMoney',
      CRYPTO: 'crypto',
    } as const;
    const field = fieldMap[balanceType];

    const character = await prisma.character.findUnique({ where: { id: characterId } });
    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    let newValue = Number(character[field]);

    if (action === 'ADD' && amount) {
      newValue += amount;
    } else if (action === 'REMOVE' && amount) {
      newValue = Math.max(0, newValue - amount);
    } else if (action === 'RESET') {
      newValue = 0;
    } else if (action === 'TRANSFER' && amount && targetCharacterId) {
      newValue = Math.max(0, newValue - amount);
      await prisma.character.update({
        where: { id: targetCharacterId },
        data: { [field]: { increment: amount } },
      });
    }

    await prisma.character.update({
      where: { id: characterId },
      data: { [field]: newValue },
    });

    await prisma.transaction.create({
      data: {
        characterId,
        type: action,
        amount: amount || 0,
        balanceType,
        reason,
        performedBy: session.userId,
      },
    });

    await prisma.log.create({
      data: {
        userId: session.userId,
        type: 'ECONOMY',
        action: `${action}_${balanceType}`,
        details: { characterId, amount, newValue },
      },
    });

    return NextResponse.json({ success: true, newValue });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
