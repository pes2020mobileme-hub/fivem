export default function JobsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold neon-text">Jobs Manager</h2>
      <p className="text-muted-foreground">Manage jobs and grades for ESX / QBCore.</p>
      <div className="glass-card">
        <p className="text-sm text-muted-foreground">
          Jobs are seeded by default (police, ambulance, mechanic, unemployed). Extend via Prisma seed or dashboard.
        </p>
      </div>
    </div>
  );
}
