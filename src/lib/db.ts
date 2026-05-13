import { neon } from '@neondatabase/serverless';

const sql = neon(import.meta.env.DATABASE_URL);

export { sql };

// leads: id, kind, payload(jsonb), score_band, source_page, ip_hash, user_agent, created_at
export async function insertLead(data: {
  kind: 'audit';
  payload: Record<string, unknown>;
  sourcePage?: string;
  ipHash?: string | null;
  userAgent?: string | null;
}) {
  const result = await sql`
    INSERT INTO leads (kind, payload, source_page, ip_hash, user_agent)
    VALUES (${data.kind}, ${JSON.stringify(data.payload)}, ${data.sourcePage ?? '/book-audit'}, ${data.ipHash ?? null}, ${data.userAgent ?? null})
    RETURNING id
  `;
  return result[0] as { id: number };
}

// newsletter_subscriptions: id, email, status, source_page, beehiiv_id, created_at
export async function insertNewsletterSub(email: string, sourcePage = '/insights') {
  await sql`
    INSERT INTO newsletter_subscriptions (email, status, source_page)
    VALUES (${email}, 'pending', ${sourcePage})
    ON CONFLICT (email) DO NOTHING
  `;
}

// waitlist: id, name, email, company, role, created_at
export async function insertWaitlist(data: {
  name: string;
  email: string;
  company: string;
  role: string;
}) {
  await sql`
    INSERT INTO waitlist (name, email, company, role)
    VALUES (${data.name}, ${data.email}, ${data.company}, ${data.role})
    ON CONFLICT (email) DO NOTHING
  `;
}
