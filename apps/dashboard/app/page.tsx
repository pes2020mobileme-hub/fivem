import Link from 'next/link';
import { Server, Bot, Brain, Shield, Zap, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cyber-grid bg-[size:50px_50px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neon-blue/30 bg-neon-blue/10 px-4 py-1.5 text-sm text-neon-blue">
            <Zap className="h-4 w-4" />
            Production Ready v3.0
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
            <span className="neon-text">FiveM Bot</span>
            <br />
            <span className="bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              Ultimate V3
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
            Complete FiveM server management system with Discord Bot, Cyberpunk Web Dashboard,
            AI Assistant powered by OpenRouter, and full ESX / QBCore support.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/dashboard" className="cyber-btn-primary px-8 py-3 text-base">
              Open Dashboard
            </Link>
            <Link href="/api/auth/discord" className="cyber-btn px-8 py-3 text-base">
              Login with Discord
            </Link>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold neon-text">Core Features</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Server,
              title: 'Live Server Monitor',
              desc: 'Realtime players, resources, CPU, RAM via Socket.IO from /info.json & /players.json',
            },
            {
              icon: Bot,
              title: 'Discord Bot v14',
              desc: 'Slash commands, embeds, modals, role permissions, webhook logs for full admin control',
            },
            {
              icon: Brain,
              title: 'AI Assistant',
              desc: 'OpenRouter integration – chat, Lua script generation, log analysis, config builder',
            },
            {
              icon: Shield,
              title: 'Ban & Whitelist',
              desc: 'Global/temp bans, Discord OAuth whitelist, role sync, approve/reject workflow',
            },
            {
              icon: Users,
              title: 'Player Manager',
              desc: 'Full character data, economy, inventory, vehicles for ESX & QBCore frameworks',
            },
            {
              icon: Zap,
              title: 'AI Build Studio',
              desc: 'Generate ESX/QBCore resources, NPCs, jobs, NUI, configs – export as ZIP',
            },
          ].map((f) => (
            <div key={f.title} className="glass-card group">
              <f.icon className="mb-4 h-10 w-10 text-neon-blue transition-transform group-hover:scale-110" />
              <h3 className="mb-2 text-xl font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 py-8 text-center text-sm text-muted-foreground">
        <p>FiveM Bot Ultimate V3 &mdash; Production Ready &mdash; ESX / QBCore Compatible</p>
      </footer>
    </div>
  );
}
