/**
 * OpenRouter AI Client
 * Supports GLM-5.3-Free, DeepSeek V3, DeepSeek R1, Z.ai
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const AI_BASE_URL = process.env.AI_BASE_URL || 'https://openrouter.ai/api/v1';
const DEFAULT_MODEL = process.env.AI_MODEL || 'glm-5.3-free';

export const ALLOWED_MODELS = [
  'glm-5.3-free',
  'deepseek/deepseek-chat',
  'deepseek/deepseek-r1',
  'z-ai/z1',
] as const;

export type AIModel = (typeof ALLOWED_MODELS)[number];

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  model?: string;
  messages: ChatMessage[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

export async function chatCompletion(options: ChatOptions) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const model = options.model || DEFAULT_MODEL;

  const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'FiveM Bot Ultimate V3',
    },
    body: JSON.stringify({
      model,
      messages: options.messages,
      stream: options.stream ?? false,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 4096,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${err}`);
  }

  if (options.stream) {
    return response;
  }

  return response.json();
}

export const SYSTEM_PROMPTS = {
  admin: `You are an expert FiveM server administrator assistant. You help with ESX, QBCore, ox_inventory, txAdmin, and general FiveM troubleshooting. Be concise and provide actionable solutions.`,

  script: `You are an expert FiveM Lua developer. Generate clean, production-ready Lua scripts for ESX or QBCore. Always include proper error handling, comments, and follow best practices. Output only the code unless asked otherwise.`,

  analyze: `You are a FiveM log analyzer expert. Analyze server logs, crash dumps, Lua errors, SQL errors, and exploit attempts. Identify root causes and provide step-by-step fixes.`,

  builder: `You are a FiveM resource generator. Create complete ESX/QBCore resources including fxmanifest.lua, client.lua, server.lua, config.lua based on user requirements. Structure code properly for production use.`,
};
