export const prerender = false;

import type { APIRoute } from 'astro';
import { newsletterSchema } from '@/lib/validation';
import { insertNewsletterSub } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';

const BEEHIIV_PUB_ID = import.meta.env.BEEHIIV_PUBLICATION_ID as string | undefined;
const BEEHIIV_API_KEY = import.meta.env.BEEHIIV_API_KEY as string | undefined;

export const POST: APIRoute = async ({ request }) => {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';

  if (!checkRateLimit(`newsletter:${ip}`, 5, 60_000)) {
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

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'Validation failed.', issues: parsed.error.issues }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { email, honeypot } = parsed.data;

  if (honeypot) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await insertNewsletterSub(email);

    // Beehiiv sync — only when both pub ID and API key present
    if (BEEHIIV_PUB_ID && BEEHIIV_API_KEY) {
      await fetch(`https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({ email, reactivate_existing: false, send_welcome_email: true }),
      }).catch((err) => console.error('[newsletter] beehiiv sync failed:', err));
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[/api/newsletter] error:', err);
    return new Response(JSON.stringify({ error: 'Subscription failed. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
