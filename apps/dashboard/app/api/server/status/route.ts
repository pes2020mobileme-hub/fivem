import { NextResponse } from 'next/server';
import { getServerStatus } from '@/lib/fivem';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await getServerStatus();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch server status', online: false },
      { status: 500 }
    );
  }
}
