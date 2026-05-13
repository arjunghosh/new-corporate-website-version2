export const prerender = false;

import type { APIRoute } from 'astro';
import { waitlistSchema } from '@/lib/validation';
import { insertWaitlist } from '@/lib/db';
import { sendWaitlistConfirmation } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';

export const POST: APIRoute = async ({ request }) => {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';

  if (!checkRateLimit(`waitlist:${ip}`, 5, 60_000)) {
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

  const parsed = waitlistSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'Validation failed.', issues: parsed.error.issues }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = parsed.data;

  if (data.honeypot) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await insertWaitlist({
      name: data.name,
      email: data.email,
      company: data.company,
      role: data.role,
    });

    await sendWaitlistConfirmation(data.email, data.name).catch((err) =>
      console.error('[waitlist] confirmation email failed:', err)
    );

    return new Response(JSON.stringify({ ok: true }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[/api/waitlist] error:', err);
    return new Response(JSON.stringify({ error: 'Waitlist submission failed. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
