/**
 * FiveM Server API Client
 * Fetches live data from /info.json, /players.json, /dynamic.json
 */

const FIVEM_SERVER = process.env.FIVEM_SERVER || 'http://127.0.0.1:30120';

export interface FiveMInfo {
  server: string;
  vars?: Record<string, string>;
  resources?: string[];
  version?: number;
}

export interface FiveMPlayer {
  id: number;
  name: string;
  ping: number;
  identifiers?: string[];
}

export interface FiveMDynamic {
  clients: number;
  gametype: string;
  hostname: string;
  mapname: string;
  maxclients: number;
  iv?: string;
}

export async function fetchServerInfo(): Promise<FiveMInfo | null> {
  try {
    const res = await fetch(`${FIVEM_SERVER}/info.json`, {
      next: { revalidate: 5 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchPlayers(): Promise<FiveMPlayer[]> {
  try {
    const res = await fetch(`${FIVEM_SERVER}/players.json`, {
      next: { revalidate: 3 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchDynamic(): Promise<FiveMDynamic | null> {
  try {
    const res = await fetch(`${FIVEM_SERVER}/dynamic.json`, {
      next: { revalidate: 5 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getServerStatus() {
  const [info, players, dynamic] = await Promise.all([
    fetchServerInfo(),
    fetchPlayers(),
    fetchDynamic(),
  ]);

  return {
    online: !!info || !!dynamic,
    serverName: dynamic?.hostname || info?.vars?.sv_projectName || 'Unknown',
    players: players.length,
    maxPlayers: dynamic?.maxclients || parseInt(info?.vars?.sv_maxclients || '32', 10),
    resources: info?.resources?.length || 0,
    resourceList: info?.resources || [],
    playersList: players,
    gametype: dynamic?.gametype || 'unknown',
    mapname: dynamic?.mapname || 'unknown',
  };
}
