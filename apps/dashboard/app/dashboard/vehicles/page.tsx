export default function VehiclesPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold neon-text">Vehicle Manager</h2>
      <p className="text-muted-foreground">
        Search by plate, owner, or model. Spawn, delete, transfer ownership, view garage history, insurance & fuel.
      </p>
      <div className="glass-card">
        <p className="text-sm text-muted-foreground">
          Vehicle data is stored via Prisma <code className="text-neon-cyan">Vehicle</code> model.
          Use API <code className="text-neon-cyan">/api/vehicle</code> for CRUD operations.
        </p>
      </div>
    </div>
  );
}
