export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold neon-text">Inventory Manager</h2>
      <p className="text-muted-foreground">
        View, add, remove items. Compatible with ox_inventory and qb-inventory.
      </p>
      <div className="glass-card">
        <p className="text-sm text-muted-foreground">
          Inventory items linked to characters via Prisma. Supports metadata and slot-based systems.
        </p>
      </div>
    </div>
  );
}
