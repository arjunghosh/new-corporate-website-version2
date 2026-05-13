import { Resend } from 'resend';

// ── Brand constants (all inline — email clients cannot load external CSS) ──
const BRAND = {
  bgOuter:    '#F2F4F7',
  bgCard:     '#FFFFFF',
  headerBg:   '#0A0C12',
  textPrimary:'#111827',
  textSec:    '#4B5563',
  textMuted:  '#6B7280',
  border:     '#E5E7EB',
  blue:       '#1B75F0',
  blueDk:     '#0B4FBD',
} as const;

const SITE_URL  = 'https://flexilytics.ai';
const LOGO_URL  = 'https://new-corporate-website-version2.vercel.app/assets/logo-full-nav.png';
const TEXT_HR   = '─'.repeat(72);

// ── Resend client + env ───────────────────────────────────────────────────
const resend = new Resend(import.meta.env.RESEND_API_KEY);
const FROM   = import.meta.env.RESEND_SENDER_EMAIL as string;
const NOTIFY = import.meta.env.LEAD_NOTIFY_EMAIL as string;
const CC_RAW = import.meta.env.ADMIN_CC_EMAILS as string | undefined;
const CC: string[] = CC_RAW
  ? CC_RAW.startsWith('[')
    ? (JSON.parse(CC_RAW) as string[])
    : CC_RAW.split(',').map((e) => e.trim()).filter(Boolean)
  : [];

// ── HTML helpers ──────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

function headerHtml(): string {
  return `<tr>
    <td style="background:${BRAND.headerBg};padding:24px 32px;border-radius:8px 8px 0 0;">
      <a href="${SITE_URL}" style="text-decoration:none;">
        <img src="${LOGO_URL}" alt="Flexilytics — Intelligence. Grounded." width="180" style="display:block;border:0;max-width:180px;height:auto;" />
      </a>
    </td>
  </tr>`;
}

function footerHtml(): string {
  return `<tr>
    <td style="padding:24px 32px;background:${BRAND.bgCard};border-radius:0 0 8px 8px;border-top:1px solid ${BRAND.border};">
      <p style="margin:0 0 4px 0;font-family:-apple-system,'Segoe UI',Arial,sans-serif;font-size:14px;font-weight:600;color:${BRAND.textPrimary};">Flexilytics Pvt. Ltd.</p>
      <p style="margin:0 0 10px 0;font-family:-apple-system,'Segoe UI',Arial,sans-serif;font-size:13px;font-style:italic;color:${BRAND.textSec};">Intelligence. Grounded.</p>
      <p style="margin:0;font-family:-apple-system,'Segoe UI',Arial,sans-serif;font-size:12px;color:${BRAND.textMuted};">
        © 2026 Flexilytics Pvt. Ltd. &middot; Mumbai, India &middot;
        <a href="mailto:hello@flexilytics.ai" style="color:${BRAND.blueDk};text-decoration:none;">hello@flexilytics.ai</a>
      </p>
    </td>
  </tr>`;
}

function wrapHtml(bodyRows: string, previewText: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Flexilytics</title></head>
<body style="margin:0;padding:0;background:${BRAND.bgOuter};font-family:-apple-system,'Segoe UI',Arial,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;">${esc(previewText)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.bgOuter};padding:24px 0;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:${BRAND.bgCard};border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
      ${headerHtml()}
      ${bodyRows}
      ${footerHtml()}
    </table>
  </td></tr>
</table>
</body></html>`;
}

function payloadRowsHtml(payload: Record<string, unknown>): string {
  const skip = new Set(['honeypot', 'honeypotField']);
  return Object.entries(payload)
    .filter(([k, v]) => !skip.has(k) && v !== undefined && v !== null && v !== '')
    .map(([k, v]) => {
      const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
      const val = typeof v === 'boolean' ? (v ? 'Yes' : 'No')
                : typeof v === 'string' ? v
                : JSON.stringify(v);
      return `<tr>
        <td style="padding:10px 16px 10px 0;vertical-align:top;font-family:-apple-system,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.textMuted};width:130px;border-bottom:1px solid ${BRAND.border};">${esc(label)}</td>
        <td style="padding:10px 0;font-family:-apple-system,'Segoe UI',Arial,sans-serif;font-size:14px;color:${BRAND.textPrimary};border-bottom:1px solid ${BRAND.border};white-space:pre-wrap;">${esc(val)}</td>
      </tr>`;
    }).join('');
}

function payloadText(payload: Record<string, unknown>): string {
  const skip = new Set(['honeypot', 'honeypotField']);
  return Object.entries(payload)
    .filter(([k, v]) => !skip.has(k) && v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}: ${typeof v === 'boolean' ? (v ? 'Yes' : 'No') : v}`)
    .join('\n');
}

// ── 1. Audit confirmation → user ──────────────────────────────────────────
export async function sendAuditConfirmation(to: string, name: string): Promise<void> {
  const fn = firstName(name);
  const preview = "Your Flexilytics AI Readiness Audit is confirmed — we'll be in touch within 24 hours.";

  const body = `<tr>
    <td style="padding:32px;font-family:-apple-system,'Segoe UI',Arial,sans-serif;color:${BRAND.textPrimary};">
      <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.blueDk};">Readiness Audit — Confirmed</p>
      <h1 style="margin:0 0 20px 0;font-size:24px;font-weight:700;line-height:1.3;color:${BRAND.textPrimary};">Hi ${esc(fn)},</h1>
      <p style="margin:0 0 16px 0;font-size:16px;line-height:1.7;color:${BRAND.textPrimary};">
        We've received your AI Readiness Audit request and will be in touch within <strong>24 hours</strong> to schedule the kick-off call.
      </p>
      <p style="margin:0 0 16px 0;font-size:16px;line-height:1.7;color:${BRAND.textPrimary};">
        The 2-week audit is how we right-size your context-engineering roadmap — grounded in your actual data systems, governance constraints, and business context. No canned deck, no generic frameworks.
      </p>
      <p style="margin:0 0 28px 0;font-size:16px;line-height:1.7;color:${BRAND.textPrimary};">Grounded intelligence starts with grounded context. Looking forward.</p>
      <p style="margin:0 0 8px 0;font-size:14px;color:${BRAND.textSec};">— Flexilytics Team</p>
      <p style="margin:28px 0 0 0;">
        <a href="${SITE_URL}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#ffffff;background:${BRAND.blue};text-decoration:none;border-radius:4px;">Visit flexilytics.ai →</a>
      </p>
    </td>
  </tr>`;

  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Your AI Audit Request — Flexilytics',
    html: wrapHtml(body, preview),
    text: [
      'Readiness Audit — Confirmed',
      TEXT_HR,
      `Hi ${fn},`,
      '',
      "We've received your AI Readiness Audit request and will be in touch within 24 hours to schedule the kick-off call.",
      '',
      'The 2-week audit is how we right-size your context-engineering roadmap — grounded in your actual data systems, governance constraints, and business context. No canned deck, no generic frameworks.',
      '',
      'Grounded intelligence starts with grounded context. Looking forward.',
      '',
      '— Flexilytics Team',
      '',
      TEXT_HR,
      'Flexilytics Pvt. Ltd. · Intelligence. Grounded.',
      '© 2026 Flexilytics Pvt. Ltd. · Mumbai, India · hello@flexilytics.ai',
      SITE_URL,
    ].join('\n'),
  });
}

// ── 2. Audit admin notification ───────────────────────────────────────────
export async function sendAuditNotification(data: Record<string, unknown>): Promise<void> {
  const company   = typeof data['company'] === 'string' ? data['company'] : '';
  const who       = typeof data['name'] === 'string' ? data['name']
                  : typeof data['email'] === 'string' ? data['email'] : 'Unknown';
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const preview   = `New AI Readiness Audit: ${who}${company ? ` · ${company}` : ''}`;

  const body = `<tr>
    <td style="padding:32px 32px 16px 32px;">
      <p style="margin:0 0 6px 0;font-family:-apple-system,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.blueDk};">[ADMIN] New Lead</p>
      <h1 style="margin:0 0 12px 0;font-family:-apple-system,'Segoe UI',Arial,sans-serif;font-size:22px;font-weight:700;color:${BRAND.textPrimary};line-height:1.3;">AI Readiness Audit Request</h1>
      <p style="margin:0;font-family:-apple-system,'Segoe UI',Arial,sans-serif;font-size:13px;color:${BRAND.textMuted};">Captured: ${esc(timestamp)} IST</p>
    </td>
  </tr>
  <tr>
    <td style="padding:0 32px 32px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:2px solid ${BRAND.textPrimary};">
        ${payloadRowsHtml(data)}
      </table>
    </td>
  </tr>`;

  await resend.emails.send({
    from: FROM,
    to: NOTIFY,
    ...(CC.length > 0 ? { cc: CC } : {}),
    subject: `New AI Audit Request — ${company || who}`,
    html: wrapHtml(body, preview),
    text: [
      '[ADMIN] New AI Readiness Audit Request',
      `Captured: ${timestamp} IST`,
      TEXT_HR,
      payloadText(data),
      TEXT_HR,
      'Flexilytics Pvt. Ltd. · Intelligence. Grounded.',
    ].join('\n'),
  });
}

// ── 3. Waitlist confirmation → user ──────────────────────────────────────
export async function sendWaitlistConfirmation(to: string, name: string): Promise<void> {
  const fn = firstName(name);
  const preview = "You're on the FlexiAnalyst waitlist — we'll notify you when early access opens.";

  const body = `<tr>
    <td style="padding:32px;font-family:-apple-system,'Segoe UI',Arial,sans-serif;color:${BRAND.textPrimary};">
      <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.blueDk};">FlexiAnalyst — Waitlist Confirmed</p>
      <h1 style="margin:0 0 20px 0;font-size:24px;font-weight:700;line-height:1.3;color:${BRAND.textPrimary};">Hi ${esc(fn)},</h1>
      <p style="margin:0 0 16px 0;font-size:16px;line-height:1.7;color:${BRAND.textPrimary};">
        You're on the FlexiAnalyst waitlist. We'll notify you directly when early access opens.
      </p>
      <p style="margin:0 0 16px 0;font-size:16px;line-height:1.7;color:${BRAND.textPrimary};">
        FlexiAnalyst is a context-aware analytics assistant built for regulated enterprises — grounded in your actual data, governance rules, and business context. Not a generic AI chatbot bolted onto a BI tool.
      </p>
      <p style="margin:0 0 28px 0;font-size:16px;line-height:1.7;color:${BRAND.textPrimary};">Intelligence. Grounded.</p>
      <p style="margin:0 0 8px 0;font-size:14px;color:${BRAND.textSec};">— Flexilytics Team</p>
      <p style="margin:28px 0 0 0;">
        <a href="${SITE_URL}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#ffffff;background:${BRAND.blue};text-decoration:none;border-radius:4px;">Visit flexilytics.ai →</a>
      </p>
    </td>
  </tr>`;

  await resend.emails.send({
    from: FROM,
    to,
    subject: "You're on the FlexiAnalyst waitlist",
    html: wrapHtml(body, preview),
    text: [
      'FlexiAnalyst — Waitlist Confirmed',
      TEXT_HR,
      `Hi ${fn},`,
      '',
      "You're on the FlexiAnalyst waitlist. We'll notify you directly when early access opens.",
      '',
      'FlexiAnalyst is a context-aware analytics assistant built for regulated enterprises — grounded in your actual data, governance rules, and business context. Not a generic AI chatbot bolted onto a BI tool.',
      '',
      'Intelligence. Grounded.',
      '',
      '— Flexilytics Team',
      '',
      TEXT_HR,
      'Flexilytics Pvt. Ltd. · Intelligence. Grounded.',
      '© 2026 Flexilytics Pvt. Ltd. · Mumbai, India · hello@flexilytics.ai',
      SITE_URL,
    ].join('\n'),
  });
}

// ── 4. Waitlist admin notification (new) ─────────────────────────────────
export async function sendWaitlistNotification(data: Record<string, unknown>): Promise<void> {
  const who       = typeof data['name'] === 'string' ? data['name']
                  : typeof data['email'] === 'string' ? data['email'] : 'Unknown';
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const preview   = `FlexiAnalyst Waitlist: ${who}`;

  const body = `<tr>
    <td style="padding:32px 32px 16px 32px;">
      <p style="margin:0 0 6px 0;font-family:-apple-system,'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.blueDk};">[ADMIN] FlexiAnalyst Waitlist</p>
      <h1 style="margin:0 0 12px 0;font-family:-apple-system,'Segoe UI',Arial,sans-serif;font-size:22px;font-weight:700;color:${BRAND.textPrimary};line-height:1.3;">New Waitlist Registration</h1>
      <p style="margin:0;font-family:-apple-system,'Segoe UI',Arial,sans-serif;font-size:13px;color:${BRAND.textMuted};">Captured: ${esc(timestamp)} IST</p>
    </td>
  </tr>
  <tr>
    <td style="padding:0 32px 32px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:2px solid ${BRAND.textPrimary};">
        ${payloadRowsHtml(data)}
      </table>
    </td>
  </tr>`;

  await resend.emails.send({
    from: FROM,
    to: NOTIFY,
    ...(CC.length > 0 ? { cc: CC } : {}),
    subject: `FlexiAnalyst Waitlist: ${who}`,
    html: wrapHtml(body, preview),
    text: [
      '[ADMIN] FlexiAnalyst Waitlist Registration',
      `Captured: ${timestamp} IST`,
      TEXT_HR,
      payloadText(data),
      TEXT_HR,
      'Flexilytics Pvt. Ltd. · Intelligence. Grounded.',
    ].join('\n'),
  });
}
