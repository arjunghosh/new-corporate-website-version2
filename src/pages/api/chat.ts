export const prerender = false;

import type { APIRoute } from 'astro';
import { checkRateLimit } from '@/lib/rate-limit';
import { knowledgeChunks } from '@/lib/chatbot-knowledge';
import { searchKnowledge } from '@/lib/chatbot-rag';

type Message = { role: 'user' | 'assistant'; content: string };

const SYSTEM_PROMPT = `You are the Flexilytics AI assistant — a helpful, concise, and professional guide for enterprise and business visitors on the Flexilytics website.

Flexilytics is the Context Engineering firm for regulated enterprise AI. Your role:
- Answer questions about Flexilytics's services, approach, products, and team.
- Help visitors understand context engineering, FlexiContext™, and our five-pillar practice.
- Guide interested companies toward booking the 2-Week Readiness Audit.
- Keep answers concise (2–4 sentences). Do not speculate beyond the provided context.
- If you don't know something, say so and suggest emailing hello@flexilytics.ai.

Use the context chunks below (retrieved from the Flexilytics knowledge base) to ground your answers. Cite content accurately; do not invent facts.`;

function buildPrompt(relevantChunks: { text: string }[], history: Message[], userMessage: string): string {
  const contextBlock = relevantChunks.map((c, i) => `[Context ${i + 1}]: ${c.text}`).join('\n\n');
  const historyBlock = history
    .slice(-6)
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  return [
    contextBlock,
    historyBlock ? `\nConversation so far:\n${historyBlock}` : '',
    `\nUser: ${userMessage}`,
  ]
    .filter(Boolean)
    .join('\n');
}

async function getEmbeddedChunks() {
  try {
    const { embeddedChunks } = await import('@/lib/chatbot-embeddings');
    return embeddedChunks;
  } catch {
    return null;
  }
}

async function embedQuery(text: string, apiKey: string): Promise<number[] | null> {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'models/text-embedding-004', content: { parts: [{ text }] } }),
    });
    if (!res.ok) return null;
    const data = await res.json() as { embedding: { values: number[] } };
    return data.embedding.values;
  } catch {
    return null;
  }
}

export const POST: APIRoute = async ({ request }) => {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!checkRateLimit(`chat:${ip}`, 10, 60_000)) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please wait a moment.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { message, history } = body as { message?: unknown; history?: unknown };

  if (typeof message !== 'string' || !message.trim()) {
    return new Response(JSON.stringify({ error: 'message must be a non-empty string.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const safeHistory: Message[] = Array.isArray(history)
    ? (history as unknown[])
        .filter(
          (m): m is Message =>
            typeof m === 'object' &&
            m !== null &&
            ((m as Message).role === 'user' || (m as Message).role === 'assistant') &&
            typeof (m as Message).content === 'string',
        )
        .slice(-10)
    : [];

  const apiKey = import.meta.env.GEMINI_API_KEY as string | undefined;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'AI service not configured.' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // RAG: vector search if embeddings available, else use all chunks
  const embeddedChunks = await getEmbeddedChunks();
  let relevantChunks: { id: string; text: string }[];

  if (embeddedChunks && embeddedChunks.length > 0) {
    const queryEmbedding = await embedQuery(message.trim(), apiKey);
    if (queryEmbedding) {
      relevantChunks = searchKnowledge(queryEmbedding, embeddedChunks, knowledgeChunks, 4);
    } else {
      relevantChunks = knowledgeChunks.slice(0, 4);
    }
  } else {
    // Fallback: all chunks as context (works before first embed run)
    relevantChunks = knowledgeChunks;
  }

  const prompt = buildPrompt(relevantChunks, safeHistory, message.trim());

  try {
    const genRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 400, temperature: 0.3 },
        }),
      },
    );

    if (!genRes.ok) {
      const errBody = await genRes.text();
      console.error('[chat] Gemini error:', genRes.status, errBody);
      return new Response(JSON.stringify({ error: 'AI service unavailable. Please try again.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const genData = await genRes.json() as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const reply = genData.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    if (!reply) {
      return new Response(JSON.stringify({ error: 'No response generated. Please try again.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[chat] unexpected error:', err);
    return new Response(JSON.stringify({ error: 'Unexpected error. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
