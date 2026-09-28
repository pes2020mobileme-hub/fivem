export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold neon-text">Settings</h2>
      <div className="glass-card space-y-4">
        <div>
          <h3 className="font-semibold">Server Connection</h3>
          <p className="text-sm text-muted-foreground">FIVEM_SERVER endpoint for live data</p>
        </div>
        <div>
          <h3 className="font-semibold">AI Model</h3>
          <p className="text-sm text-muted-foreground">Default: glm-5.3-free via OpenRouter</p>
        </div>
        <div>
          <h3 className="font-semibold">Theme</h3>
          <p className="text-sm text-muted-foreground">Cyberpunk Glassmorphism — Dark / Light toggle in header</p>
        </div>
      </div>
    </div>
  );
}
