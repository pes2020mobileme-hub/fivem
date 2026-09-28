import { NextResponse } from 'next/server';
import { fetchPlayers } from '@/lib/fivem';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const players = await fetchPlayers();
    return NextResponse.json({ players, count: players.length });
  } catch (error) {
    return NextResponse.json({ players: [], count: 0, error: 'Failed to fetch players' }, { status: 500 });
  }
}
