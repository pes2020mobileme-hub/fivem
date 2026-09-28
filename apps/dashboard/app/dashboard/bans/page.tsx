'use client';

import { useEffect, useState } from 'react';
import { Ban, Plus, Shield } from 'lucide-react';

interface BanRecord {
  id: string;
  targetName: string | null;
  reason: string;
  type: string;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  bannedBy: { username: string };
}

export default function BansPage() {
  const [bans, setBans] = useState<BanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ identifier: '', reason: '', type: 'PERMANENT' });

  const fetchBans = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ban?active=true');
      const data = await res.json();
      setBans(data.bans || []);
    } catch {
      setBans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBans();
  }, []);

  const createBan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifiers: [form.identifier],
          reason: form.reason,
          type: form.type,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ identifier: '', reason: '', type: 'PERMANENT' });
        fetchBans();
      }
    } catch {
      // handle error
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold neon-text">Ban Manager</h2>
          <p className="text-sm text-muted-foreground">{bans.length} active bans</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="cyber-btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Ban
        </button>
      </div>

      {showForm && (
        <form onSubmit={createBan} className="glass-card space-y-4">
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">Identifier</label>
            <input
              className="cyber-input"
              placeholder="license:xxx / steam:xxx / discord:xxx"
              value={form.identifier}
              onChange={(e) => setForm({ ...form, identifier: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">Reason</label>
            <input
              className="cyber-input"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">Type</label>
            <select
              className="cyber-input"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="PERMANENT">Permanent</option>
              <option value="TEMPORARY">Temporary</option>
              <option value="GLOBAL">Global</option>
            </select>
          </div>
          <button type="submit" className="cyber-btn-primary">
            Create Ban
          </button>
        </form>
      )}

      <div className="glass-card overflow-x-auto">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-14 w-full" />
            ))}
          </div>
        ) : bans.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-muted-foreground">
            <Shield className="mb-3 h-12 w-12 opacity-50" />
            <p>No active bans</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-muted-foreground">
                <th className="pb-3 pr-4">Target</th>
                <th className="pb-3 pr-4">Reason</th>
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3 pr-4">By</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {bans.map((b) => (
                <tr key={b.id} className="border-b border-white/5">
                  <td className="py-3 pr-4 font-medium">{b.targetName || '—'}</td>
                  <td className="py-3 pr-4">{b.reason}</td>
                  <td className="py-3 pr-4">
                    <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
                      {b.type}
                    </span>
                  </td>
                  <td className="py-3 pr-4">{b.bannedBy.username}</td>
                  <td className="py-3 text-muted-foreground">
                    {new Date(b.createdAt).toLocaleDateString()}
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
