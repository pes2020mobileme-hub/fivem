import { NextRequest, NextResponse } from 'next/server';
import { chatCompletion, SYSTEM_PROMPTS, ALLOWED_MODELS } from '@/lib/openrouter';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const bodySchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['system', 'user', 'assistant']),
      content: z.string().min(1),
    })
  ),
  model: z.string().optional(),
  type: z.enum(['chat', 'script', 'analyze', 'builder']).optional().default('chat'),
  stream: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { messages, model, type, stream } = parsed.data;
    const selectedModel = model && ALLOWED_MODELS.includes(model as any) ? model : undefined;

    const systemPrompt =
      type === 'script'
        ? SYSTEM_PROMPTS.script
        : type === 'analyze'
          ? SYSTEM_PROMPTS.analyze
          : type === 'builder'
            ? SYSTEM_PROMPTS.builder
            : SYSTEM_PROMPTS.admin;

    const fullMessages = [{ role: 'system' as const, content: systemPrompt }, ...messages];

    if (stream) {
      const response = await chatCompletion({
        model: selectedModel,
        messages: fullMessages,
        stream: true,
      });

      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    const result = await chatCompletion({
      model: selectedModel,
      messages: fullMessages,
      stream: false,
    });

    const content = result.choices?.[0]?.message?.content || '';
    const tokens = result.usage?.total_tokens;

    // Save history
    await prisma.aIHistory.create({
      data: {
        userId: session.userId,
        model: selectedModel || process.env.AI_MODEL || 'deepseek/deepseek-chat',
        prompt: messages[messages.length - 1]?.content || '',
        response: content,
        tokens,
        type: type === 'script' || type === 'builder' ? 'SCRIPT' : type === 'analyze' ? 'ANALYZE' : 'CHAT',
      },
    });

    return NextResponse.json({
      content,
      model: result.model,
      tokens,
    });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'AI request failed' },
      { status: 500 }
    );
  }
}
