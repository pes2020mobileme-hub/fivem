'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Briefcase,
  Car,
  Package,
  MessageSquare,
  Brain,
  Ban,
  ShieldCheck,
  Terminal,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/players', label: 'Live Players', icon: Users },
  { href: '/dashboard/economy', label: 'Economy', icon: DollarSign },
  { href: '/dashboard/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/dashboard/vehicles', label: 'Vehicles', icon: Car },
  { href: '/dashboard/inventory', label: 'Inventory', icon: Package },
  { href: '/dashboard/logs', label: 'Discord Logs', icon: MessageSquare },
  { href: '/dashboard/ai', label: 'AI Studio', icon: Brain },
  { href: '/dashboard/bans', label: 'Ban Manager', icon: Ban },
  { href: '/dashboard/whitelist', label: 'Whitelist', icon: ShieldCheck },
  { href: '/dashboard/console', label: 'Server Console', icon: Terminal },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/10 bg-black/60 backdrop-blur-xl transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple" />
            <span className="font-bold text-neon-blue">FBU V3</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-neon-blue"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                isActive ? 'sidebar-link-active' : 'sidebar-link',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-white/10 p-4 text-xs text-muted-foreground">
          FiveM Bot Ultimate V3
        </div>
      )}
    </aside>
  );
}
