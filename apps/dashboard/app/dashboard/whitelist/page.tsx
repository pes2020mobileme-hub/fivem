export default function WhitelistPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold neon-text">Whitelist System</h2>
      <p className="text-muted-foreground">
        Discord OAuth based whitelist with role sync, auto-approve, and manual approve/reject workflow.
      </p>
      <div className="glass-card">
        <p className="text-sm text-muted-foreground">
          Users apply via Discord login. Admins review pending applications. Status: PENDING / APPROVED / REJECTED.
        </p>
      </div>
    </div>
  );
}
