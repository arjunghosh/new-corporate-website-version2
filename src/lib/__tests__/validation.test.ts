import { describe, it, expect } from 'vitest';
import { auditSchema, newsletterSchema, waitlistSchema } from '../validation';

// ── auditSchema ───────────────────────────────────────────────────────────

describe('auditSchema', () => {
  const valid = {
    name: 'Ankush Shah',
    email: 'ankush@flexilytics.ai',
    company: 'Flexilytics',
    role: 'CEO',
    challenge: 'We need context engineering for our BI platform.',
    consent: true as const,
  };

  it('accepts valid audit payload', () => {
    expect(auditSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts optional fields absent', () => {
    const result = auditSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('accepts valid contact_preference enum values', () => {
    for (const pref of ['email', 'phone', 'either'] as const) {
      expect(auditSchema.safeParse({ ...valid, contact_preference: pref }).success).toBe(true);
    }
  });

  it('rejects invalid contact_preference', () => {
    expect(auditSchema.safeParse({ ...valid, contact_preference: 'slack' }).success).toBe(false);
  });

  it('rejects name shorter than 2 chars', () => {
    expect(auditSchema.safeParse({ ...valid, name: 'A' }).success).toBe(false);
  });

  it('rejects name longer than 100 chars', () => {
    expect(auditSchema.safeParse({ ...valid, name: 'A'.repeat(101) }).success).toBe(false);
  });

  it('rejects invalid email format', () => {
    expect(auditSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false);
    expect(auditSchema.safeParse({ ...valid, email: '@nodomain' }).success).toBe(false);
    expect(auditSchema.safeParse({ ...valid, email: 'missing@' }).success).toBe(false);
  });

  it('rejects empty company', () => {
    expect(auditSchema.safeParse({ ...valid, company: '' }).success).toBe(false);
  });

  it('rejects company longer than 100 chars', () => {
    expect(auditSchema.safeParse({ ...valid, company: 'X'.repeat(101) }).success).toBe(false);
  });

  it('rejects empty challenge', () => {
    expect(auditSchema.safeParse({ ...valid, challenge: '' }).success).toBe(false);
  });

  it('rejects challenge longer than 1000 chars', () => {
    expect(auditSchema.safeParse({ ...valid, challenge: 'X'.repeat(1001) }).success).toBe(false);
  });

  it('rejects consent=false', () => {
    expect(auditSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });

  it('rejects consent missing', () => {
    const { consent: _, ...noConsent } = valid;
    expect(auditSchema.safeParse(noConsent).success).toBe(false);
  });

  it('accepts honeypot as empty string', () => {
    expect(auditSchema.safeParse({ ...valid, honeypot: '' }).success).toBe(true);
  });

  it('rejects honeypot with any content (bot detection)', () => {
    expect(auditSchema.safeParse({ ...valid, honeypot: 'filled' }).success).toBe(false);
    expect(auditSchema.safeParse({ ...valid, honeypot: '<script>' }).success).toBe(false);
    expect(auditSchema.safeParse({ ...valid, honeypot: ' ' }).success).toBe(false);
  });

  // Security: XSS/injection payloads pass schema (Zod validates shape, not content)
  // XSS escaping happens in email.ts esc() — tested separately in email.test.ts
  it('accepts XSS payload in name (escaped downstream in email)', () => {
    const result = auditSchema.safeParse({ ...valid, name: '<script>alert(1)</script>' });
    expect(result.success).toBe(true);
  });

  it('accepts SQL injection payload in company (parameterized queries handle this)', () => {
    const result = auditSchema.safeParse({ ...valid, company: "'; DROP TABLE leads; --" });
    expect(result.success).toBe(true);
  });

  it('rejects completely missing required fields', () => {
    expect(auditSchema.safeParse({}).success).toBe(false);
    expect(auditSchema.safeParse({ email: valid.email }).success).toBe(false);
  });
});

// ── newsletterSchema ──────────────────────────────────────────────────────

describe('newsletterSchema', () => {
  it('accepts valid email', () => {
    expect(newsletterSchema.safeParse({ email: 'user@company.com' }).success).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(newsletterSchema.safeParse({ email: 'not-email' }).success).toBe(false);
    expect(newsletterSchema.safeParse({ email: '' }).success).toBe(false);
    expect(newsletterSchema.safeParse({ email: 'a@' }).success).toBe(false);
  });

  it('rejects email-based header injection attempt', () => {
    // Zod .email() uses RFC-based validation — rejects header injection chars
    expect(newsletterSchema.safeParse({ email: 'user@domain.com\r\nBcc: evil@evil.com' }).success).toBe(false);
  });

  it('accepts empty honeypot', () => {
    expect(newsletterSchema.safeParse({ email: 'user@test.com', honeypot: '' }).success).toBe(true);
  });

  it('rejects non-empty honeypot', () => {
    expect(newsletterSchema.safeParse({ email: 'user@test.com', honeypot: 'bot' }).success).toBe(false);
  });

  it('rejects missing email', () => {
    expect(newsletterSchema.safeParse({}).success).toBe(false);
  });
});

// ── waitlistSchema ────────────────────────────────────────────────────────

describe('waitlistSchema', () => {
  const valid = {
    name: 'Arjun Ghosh',
    email: 'arjun@flexilytics.ai',
    company: 'Flexilytics',
    role: 'CRO / VP Sales',
  };

  it('accepts valid waitlist payload', () => {
    expect(waitlistSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects name shorter than 2 chars', () => {
    expect(waitlistSchema.safeParse({ ...valid, name: 'A' }).success).toBe(false);
  });

  it('rejects empty company', () => {
    expect(waitlistSchema.safeParse({ ...valid, company: '' }).success).toBe(false);
  });

  it('rejects empty role', () => {
    expect(waitlistSchema.safeParse({ ...valid, role: '' }).success).toBe(false);
  });

  it('rejects invalid email', () => {
    expect(waitlistSchema.safeParse({ ...valid, email: 'bad-email' }).success).toBe(false);
  });

  it('accepts empty honeypot', () => {
    expect(waitlistSchema.safeParse({ ...valid, honeypot: '' }).success).toBe(true);
  });

  it('rejects filled honeypot', () => {
    expect(waitlistSchema.safeParse({ ...valid, honeypot: 'human' }).success).toBe(false);
  });

  it('rejects all missing required fields', () => {
    expect(waitlistSchema.safeParse({}).success).toBe(false);
  });

  // Max length guards
  it('rejects name over 100 chars', () => {
    expect(waitlistSchema.safeParse({ ...valid, name: 'A'.repeat(101) }).success).toBe(false);
  });

  it('rejects role over 100 chars', () => {
    expect(waitlistSchema.safeParse({ ...valid, role: 'X'.repeat(101) }).success).toBe(false);
  });
});
