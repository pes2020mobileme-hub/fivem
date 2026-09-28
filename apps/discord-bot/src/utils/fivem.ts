const FIVEM_SERVER = process.env.FIVEM_SERVER || 'http://127.0.0.1:30120';

interface FiveMInfo {
  vars?: Record<string, string>;
  resources?: string[];
}

interface FiveMDynamic {
  hostname?: string;
  maxclients?: number;
}

interface FiveMPlayer {
  id: number;
  name: string;
  ping: number;
}

export async function getServerStatus() {
  try {
    const [infoRes, playersRes, dynamicRes] = await Promise.all([
      fetch(`${FIVEM_SERVER}/info.json`, { signal: AbortSignal.timeout(4000) }).catch(() => null),
      fetch(`${FIVEM_SERVER}/players.json`, { signal: AbortSignal.timeout(4000) }).catch(() => null),
      fetch(`${FIVEM_SERVER}/dynamic.json`, { signal: AbortSignal.timeout(4000) }).catch(() => null),
    ]);

    const info = infoRes?.ok ? ((await infoRes.json()) as FiveMInfo) : null;
    const players = playersRes?.ok ? ((await playersRes.json()) as FiveMPlayer[]) : [];
    const dynamic = dynamicRes?.ok ? ((await dynamicRes.json()) as FiveMDynamic) : null;

    return {
      online: !!(info || dynamic),
      name: dynamic?.hostname || info?.vars?.sv_projectName || 'Unknown Server',
      players: players.length,
      maxPlayers: dynamic?.maxclients || 32,
      playerList: players,
      resources: info?.resources?.length || 0,
    };
  } catch {
    return { online: false, name: 'Offline', players: 0, maxPlayers: 0, playerList: [], resources: 0 };
  }
}
