const FIVEM_SERVER = process.env.FIVEM_SERVER || 'http://127.0.0.1:30120';

export async function getServerStatus() {
  try {
    const [infoRes, playersRes, dynamicRes] = await Promise.all([
      fetch(`${FIVEM_SERVER}/info.json`, { signal: AbortSignal.timeout(4000) }).catch(() => null),
      fetch(`${FIVEM_SERVER}/players.json`, { signal: AbortSignal.timeout(4000) }).catch(() => null),
      fetch(`${FIVEM_SERVER}/dynamic.json`, { signal: AbortSignal.timeout(4000) }).catch(() => null),
    ]);

    const info = infoRes?.ok ? await infoRes.json() : null;
    const players = playersRes?.ok ? await playersRes.json() : [];
    const dynamic = dynamicRes?.ok ? await dynamicRes.json() : null;

    return {
      online: !!(info || dynamic),
      name: dynamic?.hostname || info?.vars?.sv_projectName || 'Unknown Server',
      players: players.length,
      maxPlayers: dynamic?.maxclients || 32,
      playerList: players as Array<{ id: number; name: string; ping: number }>,
      resources: info?.resources?.length || 0,
    };
  } catch {
    return { online: false, name: 'Offline', players: 0, maxPlayers: 0, playerList: [], resources: 0 };
  }
}
