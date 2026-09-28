import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';
import type { Role } from '@prisma/client';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production'
);

export interface SessionPayload {
  userId: string;
  discordId: string;
  username: string;
  role: Role;
  avatar?: string;
}

export async function createSession(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return token;
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function requireAuth(minRole: Role = 'PLAYER'): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const roleHierarchy: Record<Role, number> = {
    PLAYER: 0,
    SUPPORT: 1,
    MODERATOR: 2,
    ADMIN: 3,
  };

  if (roleHierarchy[session.role] < roleHierarchy[minRole]) {
    throw new Error('Forbidden');
  }

  return session;
}

export async function syncDiscordUser(discordData: {
  id: string;
  username: string;
  discriminator?: string;
  avatar?: string;
  email?: string;
}) {
  return prisma.user.upsert({
    where: { discordId: discordData.id },
    update: {
      username: discordData.username,
      discriminator: discordData.discriminator,
      avatar: discordData.avatar,
      email: discordData.email,
      lastLogin: new Date(),
    },
    create: {
      discordId: discordData.id,
      username: discordData.username,
      discriminator: discordData.discriminator,
      avatar: discordData.avatar,
      email: discordData.email,
      lastLogin: new Date(),
    },
  });
}
