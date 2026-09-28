import { NextRequest, NextResponse } from 'next/server';
import { syncDiscordUser, createSession } from '@/lib/auth';

const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/discord';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', req.url));
  }

  try {
    // Exchange code for token
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenRes.ok) {
      throw new Error('Token exchange failed');
    }

    const tokenData = await tokenRes.json();

    // Fetch user
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userRes.ok) {
      throw new Error('Failed to fetch user');
    }

    const discordUser = await userRes.json();

    const user = await syncDiscordUser({
      id: discordUser.id,
      username: discordUser.username,
      discriminator: discordUser.discriminator,
      avatar: discordUser.avatar
        ? `${discordUser.id}/${discordUser.avatar}`
        : undefined,
      email: discordUser.email,
    });

    await createSession({
      userId: user.id,
      discordId: user.discordId,
      username: user.username,
      role: user.role,
      avatar: user.avatar || undefined,
    });

    return NextResponse.redirect(new URL('/dashboard', req.url));
  } catch (error) {
    console.error('Discord OAuth error:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', req.url));
  }
}
