'use client';

import { useState, useRef, useEffect } from 'react';
import { Brain, Send, Loader2, Code, FileSearch, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

type AIType = 'chat' | 'script' | 'analyze' | 'builder';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const MODES = [
  { id: 'chat' as AIType, label: 'Admin Assistant', icon: Brain },
  { id: 'script' as AIType, label: 'Lua Script', icon: Code },
  { id: 'analyze' as AIType, label: 'Log Analyzer', icon: FileSearch },
  { id: 'builder' as AIType, label: 'Resource Builder', icon: Wrench },
];

export default function AIStudioPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AIType>('chat');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          type: mode,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${err instanceof Error ? err.message : 'Request failed'}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold neon-text">AI Studio</h2>
          <p className="text-sm text-muted-foreground">Powered by OpenRouter</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-all',
                mode === m.id
                  ? 'border-neon-blue bg-neon-blue/10 text-neon-blue'
                  : 'border-white/10 text-muted-foreground hover:border-white/20'
              )}
            >
              <m.icon className="h-4 w-4" />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card flex flex-1 flex-col overflow-hidden p-0">
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <Brain className="mb-4 h-16 w-16 opacity-30" />
              <p className="text-lg">Start a conversation with the AI</p>
              <p className="text-sm">Ask about FiveM, generate scripts, or analyze logs</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                'max-w-[85%] rounded-xl px-4 py-3 text-sm',
                m.role === 'user'
                  ? 'ml-auto bg-neon-blue/20 text-neon-blue'
                  : 'mr-auto bg-white/5 text-foreground'
              )}
            >
              <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking...
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder={
                mode === 'script'
                  ? 'Describe the Lua script you need...'
                  : mode === 'analyze'
                    ? 'Paste logs or describe the error...'
                    : mode === 'builder'
                      ? 'Describe the resource to generate...'
                      : 'Ask anything about FiveM admin...'
              }
              className="cyber-input flex-1"
              disabled={loading}
            />
            <button onClick={send} disabled={loading || !input.trim()} className="cyber-btn-primary px-4">
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
