'use client';

import { useEffect, useState } from 'react';
import { Users, RefreshCw, Search } from 'lucide-react';

interface Player {
  id: number;
  name: string;
  ping: number;
  identifiers?: string[];
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/server/players');
      const data = await res.json();
      setPlayers(data.players || []);
    } catch {
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
    const interval = setInterval(fetchPlayers, 10000);
    return () => clearInterval(interval);
  }, []);

  const filtered = players.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      String(p.id).includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold neon-text">Live Players</h2>
          <p className="text-sm text-muted-foreground">{players.length} players online</p>
        </div>
        <button onClick={fetchPlayers} className="cyber-btn flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="cyber-input pl-10"
        />
      </div>

      <div className="glass-card overflow-x-auto">
        {loading && players.length === 0 ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-12 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-muted-foreground">
            <Users className="mb-3 h-12 w-12 opacity-50" />
            <p>No players found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-muted-foreground">
                <th className="pb-3 pr-4">ID</th>
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Ping</th>
                <th className="pb-3">Identifiers</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 pr-4 font-mono text-neon-blue">{p.id}</td>
                  <td className="py-3 pr-4 font-medium">{p.name}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={
                        p.ping < 50
                          ? 'text-neon-cyan'
                          : p.ping < 100
                            ? 'text-yellow-400'
                            : 'text-red-400'
                      }
                    >
                      {p.ping}ms
                    </span>
                  </td>
                  <td className="py-3 font-mono text-xs text-muted-foreground">
                    {p.identifiers?.slice(0, 2).join(', ') || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
