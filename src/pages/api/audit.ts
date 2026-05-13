export const prerender = false;

import type { APIRoute } from 'astro';
import { auditSchema } from '@/lib/validation';
import { insertLead } from '@/lib/db';
import { sendAuditConfirmation, sendAuditNotification } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';

export const POST: APIRoute = async ({ request }) => {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';

  if (!checkRateLimit(`audit:${ip}`, 5, 60_000)) {
    return new Response(JSON.stringify({ error: 'Too many requests.' }), {
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

  const parsed = auditSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'Validation failed.', issues: parsed.error.issues }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = parsed.data;

  // Honeypot check — silently accept
  if (data.honeypot) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await insertLead({
      kind: 'audit',
      payload: data as unknown as Record<string, unknown>,
      sourcePage: '/book-audit',
      userAgent: request.headers.get('user-agent'),
    });

    await Promise.allSettled([
      sendAuditConfirmation(data.email, data.name),
      sendAuditNotification(data as unknown as Record<string, unknown>),
    ]);

    return new Response(JSON.stringify({ ok: true }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[/api/audit] error:', err);
    return new Response(JSON.stringify({ error: 'Submission failed. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
