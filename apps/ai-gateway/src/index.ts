import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../../../.env') });

const app = express();
const PORT = process.env.AI_GATEWAY_PORT || 3002;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const AI_BASE_URL = process.env.AI_BASE_URL || 'https://openrouter.ai/api/v1';
const DEFAULT_MODEL = process.env.AI_MODEL || 'deepseek/deepseek-chat';

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ai-gateway', model: DEFAULT_MODEL });
});

app.post('/v1/chat', async (req, res) => {
  try {
    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured' });
    }

    const { messages, model, stream, temperature, max_tokens } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }

    const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'FiveM Bot Ultimate V3 AI Gateway',
      },
      body: JSON.stringify({
        model: model || DEFAULT_MODEL,
        messages,
        stream: stream || false,
        temperature: temperature ?? 0.7,
        max_tokens: max_tokens ?? 4096,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      const reader = response.body?.getReader();
      if (!reader) return res.status(500).json({ error: 'No stream' });

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(decoder.decode(value));
      }
      res.end();
      return;
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('AI Gateway error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🧠 AI Gateway running on port ${PORT}`);
});
