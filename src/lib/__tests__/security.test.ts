import { describe, it, expect } from 'vitest';
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { auditSchema, newsletterSchema, waitlistSchema } from '../validation';

const ROOT = join(process.cwd());

// ── CSP & Security Headers (vercel.json) ─────────────────────────────────

describe('vercel.json security headers', () => {
  const vercelJson = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'));
  const headers: Array<{ key: string; value: string }> =
    vercelJson.headers?.[0]?.headers ?? [];
  const get = (key: string) => headers.find((h) => h.key === key)?.value ?? '';

  const csp = get('Content-Security-Policy');

  it('has Content-Security-Policy header', () => {
    expect(csp.length).toBeGreaterThan(0);
  });

  it('CSP default-src is self only', () => {
    expect(csp).toContain("default-src 'self'");
  });

  it('CSP object-src is none (blocks Flash/plugins)', () => {
    expect(csp).toContain("object-src 'none'");
  });

  it('CSP frame-ancestors is self (blocks clickjacking)', () => {
    expect(csp).toContain("frame-ancestors 'self'");
  });

  it('CSP base-uri is self (blocks base tag injection)', () => {
    expect(csp).toContain("base-uri 'self'");
  });

  it('CSP connect-src allows GA4 and Beehiiv', () => {
    expect(csp).toContain('https://www.google-analytics.com');
    expect(csp).toContain('https://api.beehiiv.com');
  });

  it('CSP script-src allows GTM (needed for GA4)', () => {
    expect(csp).toContain('https://www.googletagmanager.com');
  });

  it('CSP img-src allows https (for OG images, logo CDN)', () => {
    expect(csp).toContain('img-src');
    expect(csp).toContain('https:');
  });

  it('CSP upgrade-insecure-requests present', () => {
    expect(csp).toContain('upgrade-insecure-requests');
  });

  it('X-Content-Type-Options is nosniff (prevents MIME sniffing)', () => {
    expect(get('X-Content-Type-Options')).toBe('nosniff');
  });

  it('X-Frame-Options is SAMEORIGIN (clickjacking layer 2)', () => {
    expect(get('X-Frame-Options')).toBe('SAMEORIGIN');
  });

  it('Referrer-Policy is strict-origin-when-cross-origin', () => {
    expect(get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
  });

  it('HSTS present with 1-year max-age and includeSubDomains', () => {
    const hsts = get('Strict-Transport-Security');
    expect(hsts).toContain('max-age=31536000');
    expect(hsts).toContain('includeSubDomains');
  });

  it('Permissions-Policy disables camera, microphone, geolocation, payment', () => {
    const pp = get('Permissions-Policy');
    expect(pp).toContain('camera=()');
    expect(pp).toContain('microphone=()');
    expect(pp).toContain('geolocation=()');
    expect(pp).toContain('payment=()');
  });

  it('cleanUrls enabled (no .html exposure)', () => {
    expect(vercelJson.cleanUrls).toBe(true);
  });

  it('trailingSlash disabled (canonical URL consistency)', () => {
    expect(vercelJson.trailingSlash).toBe(false);
  });
});

// ── Form injection attack surface ─────────────────────────────────────────

describe('form injection hardening via Zod schemas', () => {
  // Email header injection
  it('auditSchema rejects CRLF in email (header injection)', () => {
    expect(auditSchema.safeParse({
      name: 'Test', email: 'test@test.com\r\nBcc:evil@evil.com',
      company: 'Co', role: 'CEO', challenge: 'X', consent: true,
    }).success).toBe(false);
  });

  it('newsletterSchema rejects CRLF email injection', () => {
    expect(newsletterSchema.safeParse({
      email: 'legit@domain.com\nContent-Type: text/html',
    }).success).toBe(false);
  });

  // Oversized payloads (DoS prevention via length limits)
  it('auditSchema blocks 10KB challenge (max 1000 chars)', () => {
    expect(auditSchema.safeParse({
      name: 'Test', email: 'test@test.com',
      company: 'Co', role: 'CEO', challenge: 'X'.repeat(10_000), consent: true,
    }).success).toBe(false);
  });

  it('auditSchema blocks 10KB company name', () => {
    expect(auditSchema.safeParse({
      name: 'Test', email: 'test@test.com',
      company: 'X'.repeat(10_000), role: 'CEO', challenge: 'y', consent: true,
    }).success).toBe(false);
  });

  // Honeypot must be absent or empty
  it('all schemas reject any honeypot content', () => {
    const payloads = ['1', ' ', '<script>', 'bot@evil.com', 'true'];
    for (const hp of payloads) {
      expect(auditSchema.safeParse({
        name: 'Test', email: 'test@test.com',
        company: 'Co', role: 'CEO', challenge: 'X', consent: true, honeypot: hp,
      }).success).toBe(false);
      expect(newsletterSchema.safeParse({ email: 'test@test.com', honeypot: hp }).success).toBe(false);
      expect(waitlistSchema.safeParse({
        name: 'Test', email: 'test@test.com', company: 'Co', role: 'CEO', honeypot: hp,
      }).success).toBe(false);
    }
  });

  // Consent enforcement (GDPR / DPDP Act compliance)
  it('auditSchema requires explicit consent=true', () => {
    const base = { name: 'Test', email: 'a@b.com', company: 'Co', role: 'CEO', challenge: 'X' };
    expect(auditSchema.safeParse({ ...base, consent: false }).success).toBe(false);
    expect(auditSchema.safeParse({ ...base, consent: 'true' }).success).toBe(false);
    expect(auditSchema.safeParse({ ...base, consent: 1 }).success).toBe(false);
    expect(auditSchema.safeParse({ ...base }).success).toBe(false);
    expect(auditSchema.safeParse({ ...base, consent: true }).success).toBe(true);
  });

  // Type coercion attacks (sending unexpected types)
  it('auditSchema rejects object in name field', () => {
    expect(auditSchema.safeParse({
      name: { toString: () => '<script>' }, email: 'a@b.com',
      company: 'Co', role: 'R', challenge: 'X', consent: true,
    }).success).toBe(false);
  });

  it('auditSchema rejects array in email field', () => {
    expect(auditSchema.safeParse({
      name: 'Test', email: ['a@b.com'],
      company: 'Co', role: 'R', challenge: 'X', consent: true,
    }).success).toBe(false);
  });

  it('auditSchema rejects null values in required fields', () => {
    expect(auditSchema.safeParse({
      name: null, email: 'a@b.com',
      company: 'Co', role: 'R', challenge: 'X', consent: true,
    }).success).toBe(false);
  });
});

// ── Favicon integrity ─────────────────────────────────────────────────────

describe('favicon asset integrity', () => {
  const faviconPath = join(ROOT, 'public', 'favicon.ico');
  const faviconBuf = readFileSync(faviconPath);

  it('favicon exists at public/favicon.ico', () => {
    const stat = statSync(faviconPath);
    expect(stat.isFile()).toBe(true);
  });

  it('favicon is brand ICO (9681 bytes) — not placeholder (707 bytes) or wrong triangle asset (25931 bytes)', () => {
    expect(faviconBuf.byteLength).toBe(9681);
  });

  it('favicon MD5 matches known-good brand asset (teal F logo, RGBA, 4-frame)', () => {
    const md5 = createHash('md5').update(faviconBuf).digest('hex');
    expect(md5).toBe('397fe0d9ef235cdffd2e9fc47f3298ef');
  });

  it('favicon has valid ICO magic bytes (00 00 01 00)', () => {
    // ICO format: reserved=0x0000, type=0x0001 (icon)
    expect(faviconBuf[0]).toBe(0x00);
    expect(faviconBuf[1]).toBe(0x00);
    expect(faviconBuf[2]).toBe(0x01);
    expect(faviconBuf[3]).toBe(0x00);
  });

  it('favicon is multi-resolution ICO (≥4 frames)', () => {
    // Bytes 4-5 (little-endian uint16) = number of images in ICO
    const frameCount = faviconBuf[4] + (faviconBuf[5] << 8);
    expect(frameCount).toBeGreaterThanOrEqual(4);
  });
});

// ── robots.txt ────────────────────────────────────────────────────────────

describe('robots.txt AI crawler access', () => {
  const robots = readFileSync(join(ROOT, 'public', 'robots.txt'), 'utf8');

  it('allows GPTBot', () => {
    expect(robots).toContain('User-agent: GPTBot');
    expect(robots).toMatch(/User-agent: GPTBot[\s\S]*?Allow/);
  });

  it('allows ClaudeBot', () => {
    expect(robots).toContain('ClaudeBot');
  });

  it('references sitemap', () => {
    expect(robots).toMatch(/Sitemap:/i);
  });

  it('does not disallow all for any AI crawler block', () => {
    // No "Disallow: /" after any of the named AI crawlers
    const lines = robots.split('\n');
    let inAiBlock = false;
    for (const line of lines) {
      if (line.startsWith('User-agent:') && (
        line.includes('GPTBot') || line.includes('ClaudeBot') ||
        line.includes('anthropic') || line.includes('Google-Extended')
      )) {
        inAiBlock = true;
      } else if (line.startsWith('User-agent:')) {
        inAiBlock = false;
      }
      if (inAiBlock && line.trim() === 'Disallow: /') {
        throw new Error(`AI crawler blocked by Disallow: / near: ${line}`);
      }
    }
  });
});
