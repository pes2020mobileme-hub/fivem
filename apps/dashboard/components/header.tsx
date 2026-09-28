'use client';

import { Bell, Moon, Sun, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  title: string;
  user?: {
    username: string;
    avatar?: string;
    role: string;
  };
}

export function Header({ title, user }: HeaderProps) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('light', !dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-black/40 px-6 backdrop-blur-xl">
      <h1 className="text-xl font-semibold neon-text">{title}</h1>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setDark(!dark)}
          className="rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-neon-blue"
        >
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-neon-blue">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-neon-pink" />
        </button>

        {user && (
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
            {user.avatar ? (
              <img
                src={`https://cdn.discordapp.com/avatars/${user.avatar}`}
                alt={user.username}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neon-blue/20 text-sm font-bold text-neon-blue">
                {user.username[0]?.toUpperCase()}
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-sm font-medium">{user.username}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role.toLowerCase()}</p>
            </div>
            <button className="ml-1 text-muted-foreground hover:text-red-400">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
