import { getServerStatus } from '@/lib/fivem';
import { Users, Server, Cpu, Activity, HardDrive, Wifi } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const status = await getServerStatus();

  const stats = [
    {
      label: 'Online Players',
      value: `${status.players} / ${status.maxPlayers}`,
      icon: Users,
      color: 'text-neon-blue',
    },
    {
      label: 'Server Status',
      value: status.online ? 'Online' : 'Offline',
      icon: Server,
      color: status.online ? 'text-neon-cyan' : 'text-red-400',
    },
    {
      label: 'Resources',
      value: formatNumber(status.resources),
      icon: HardDrive,
      color: 'text-neon-purple',
    },
    {
      label: 'Game Type',
      value: status.gametype || 'N/A',
      icon: Activity,
      color: 'text-neon-pink',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Server Name */}
      <div className="glass-card">
        <h2 className="text-2xl font-bold neon-text">{status.serverName}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Map: {status.mapname} &bull; Live data from FiveM endpoints
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Players Preview */}
      <div className="glass-card">
        <h3 className="mb-4 text-lg font-semibold">Live Players</h3>
        {status.playersList.length === 0 ? (
          <p className="text-muted-foreground">No players online or server unreachable.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-muted-foreground">
                  <th className="pb-3 pr-4">ID</th>
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3">Ping</th>
                </tr>
              </thead>
              <tbody>
                {status.playersList.slice(0, 10).map((p) => (
                  <tr key={p.id} className="border-b border-white/5">
                    <td className="py-2.5 pr-4 font-mono text-neon-blue">{p.id}</td>
                    <td className="py-2.5 pr-4">{p.name}</td>
                    <td className="py-2.5">
                      <span className={p.ping < 50 ? 'text-neon-cyan' : p.ping < 100 ? 'text-yellow-400' : 'text-red-400'}>
                        {p.ping}ms
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resources */}
      {status.resourceList.length > 0 && (
        <div className="glass-card">
          <h3 className="mb-4 text-lg font-semibold">Running Resources ({status.resources})</h3>
          <div className="flex flex-wrap gap-2">
            {status.resourceList.slice(0, 30).map((r) => (
              <span
                key={r}
                className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-mono text-neon-cyan"
              >
                {r}
              </span>
            ))}
            {status.resourceList.length > 30 && (
              <span className="rounded-md px-2.5 py-1 text-xs text-muted-foreground">
                +{status.resourceList.length - 30} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
