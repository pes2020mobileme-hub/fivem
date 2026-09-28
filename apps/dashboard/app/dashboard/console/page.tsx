export default function ConsolePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold neon-text">Server Console</h2>
      <p className="text-muted-foreground">
        Web console for start / stop / restart resources. txAdmin API support.
      </p>
      <div className="glass-card font-mono text-sm">
        <p className="text-muted-foreground">
          Configure TXADMIN_URL and TXADMIN_TOKEN in environment variables to enable resource control.
        </p>
        <div className="mt-4 rounded-lg bg-black/60 p-4 text-neon-cyan">
          $ ready — connect txAdmin to send commands
        </div>
      </div>
    </div>
  );
}
