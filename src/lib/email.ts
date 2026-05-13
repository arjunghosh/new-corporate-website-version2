import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const FROM = import.meta.env.RESEND_SENDER_EMAIL as string;
const NOTIFY = import.meta.env.LEAD_NOTIFY_EMAIL as string;
const CC_RAW = import.meta.env.ADMIN_CC_EMAILS as string | undefined;
const CC: string[] = CC_RAW
  ? CC_RAW.startsWith('[')
    ? JSON.parse(CC_RAW)
    : CC_RAW.split(',').map((e) => e.trim()).filter(Boolean)
  : [];

export async function sendAuditConfirmation(to: string, name: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Your AI Audit Request — Flexilytics',
    html: `<p>Hi ${name},</p><p>We've received your AI audit request and will be in touch within 24 hours.</p><p>— Flexilytics Team</p>`,
  });
}

export async function sendAuditNotification(data: Record<string, unknown>) {
  await resend.emails.send({
    from: FROM,
    to: NOTIFY,
    ...(CC.length > 0 ? { cc: CC } : {}),
    subject: `New AI Audit Request — ${data['company']}`,
    html: `<pre>${JSON.stringify(data, null, 2)}</pre>`,
  });
}

export async function sendWaitlistConfirmation(to: string, name: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "You're on the FlexiAnalyst waitlist",
    html: `<p>Hi ${name},</p><p>You're on the FlexiAnalyst waitlist. We'll notify you when access opens.</p><p>— Flexilytics Team</p>`,
  });
}
