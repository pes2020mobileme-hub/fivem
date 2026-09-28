export default function EconomyPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold neon-text">Economy Manager</h2>
      <p className="text-muted-foreground">
        View and manage player cash, bank, black money (ESX), and crypto (QBCore). Transaction history and transfer tools.
      </p>
      <div className="glass-card">
        <p className="text-sm text-muted-foreground">
          Connect your database and use the API routes <code className="text-neon-cyan">/api/economy</code> to manage balances.
          Supports add, remove, transfer, and reset operations with full audit logging.
        </p>
      </div>
    </div>
  );
}
