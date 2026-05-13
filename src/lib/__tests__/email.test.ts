import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Resend before importing email module
const mockSend = vi.fn().mockResolvedValue({ id: 'test-email-id' });
vi.mock('resend', () => ({
  Resend: vi.fn(function () {
    return { emails: { send: mockSend } };
  }),
}));

// Import after mock is registered
const { sendAuditConfirmation, sendAuditNotification, sendWaitlistConfirmation, sendWaitlistNotification } =
  await import('../email');

describe('sendAuditConfirmation', () => {
  beforeEach(() => mockSend.mockClear());

  it('calls resend.emails.send once', async () => {
    await sendAuditConfirmation('user@test.com', 'Arjun Ghosh');
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('uses correct recipient', async () => {
    await sendAuditConfirmation('arjun@flexilytics.ai', 'Arjun');
    const call = mockSend.mock.calls[0][0];
    expect(call.to).toBe('arjun@flexilytics.ai');
  });

  it('extracts first name from full name', async () => {
    await sendAuditConfirmation('test@test.com', 'Ankush Shah');
    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain('Ankush');
    expect(call.html).not.toContain('Shah,');
    expect(call.text).toContain('Hi Ankush');
  });

  it('includes correct subject', async () => {
    await sendAuditConfirmation('test@test.com', 'Test User');
    expect(mockSend.mock.calls[0][0].subject).toBe('Your AI Audit Request — Flexilytics');
  });

  // XSS prevention: name with HTML tags must be escaped in email HTML
  it('escapes XSS in name — HTML output', async () => {
    await sendAuditConfirmation('test@test.com', '<script>alert(1)</script>');
    const html = mockSend.mock.calls[0][0].html as string;
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('escapes double quotes in name', async () => {
    await sendAuditConfirmation('test@test.com', '"Admin"');
    const html = mockSend.mock.calls[0][0].html as string;
    expect(html).not.toMatch(/="Admin"/);
    expect(html).toContain('&quot;Admin&quot;');
  });

  it('escapes ampersand in name', async () => {
    await sendAuditConfirmation('test@test.com', 'R&D Lead');
    const html = mockSend.mock.calls[0][0].html as string;
    expect(html).toContain('R&amp;D');
    expect(html).not.toContain('"R&D"');
  });

  it('includes plain text companion', async () => {
    await sendAuditConfirmation('test@test.com', 'User');
    const call = mockSend.mock.calls[0][0];
    expect(typeof call.text).toBe('string');
    expect(call.text.length).toBeGreaterThan(0);
  });

  it('includes flexilytics.ai site link in html', async () => {
    await sendAuditConfirmation('test@test.com', 'User');
    expect(mockSend.mock.calls[0][0].html).toContain('flexilytics.ai');
  });
});

describe('sendAuditNotification', () => {
  beforeEach(() => mockSend.mockClear());

  const payload = {
    name: 'Ankush Shah',
    email: 'ankush@flexilytics.ai',
    company: 'Flexilytics',
    role: 'CEO',
    challenge: 'Context engineering for BFSI',
    consent: true,
  };

  it('calls resend.emails.send once', async () => {
    await sendAuditNotification(payload);
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('includes company in subject', async () => {
    await sendAuditNotification(payload);
    expect(mockSend.mock.calls[0][0].subject).toContain('Flexilytics');
  });

  it('uses company name in subject when present', async () => {
    await sendAuditNotification(payload);
    expect(mockSend.mock.calls[0][0].subject).toBe('New AI Audit Request — Flexilytics');
  });

  it('falls back to name in subject when company absent', async () => {
    const { company: _, ...noCompany } = payload;
    await sendAuditNotification(noCompany);
    expect(mockSend.mock.calls[0][0].subject).toContain('Ankush Shah');
  });

  // XSS prevention: all user payload fields must be escaped in HTML
  it('escapes XSS in company name', async () => {
    await sendAuditNotification({ ...payload, company: '<img src=x onerror=alert(1)>' });
    const html = mockSend.mock.calls[0][0].html as string;
    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;img');
  });

  it('escapes XSS in role field', async () => {
    await sendAuditNotification({ ...payload, role: '<svg onload=alert(1)>' });
    const html = mockSend.mock.calls[0][0].html as string;
    expect(html).not.toContain('<svg');
    expect(html).toContain('&lt;svg');
  });

  it('escapes XSS in challenge field', async () => {
    await sendAuditNotification({ ...payload, challenge: '"><script>document.cookie</script>' });
    const html = mockSend.mock.calls[0][0].html as string;
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('escapes HTML entities in name', async () => {
    await sendAuditNotification({ ...payload, name: 'O\'Brien & Associates' });
    const html = mockSend.mock.calls[0][0].html as string;
    expect(html).toContain('&amp;');
  });

  it('excludes honeypot field from payload rows', async () => {
    await sendAuditNotification({ ...payload, honeypot: '' });
    const html = mockSend.mock.calls[0][0].html as string;
    expect(html).not.toContain('>Honeypot<');
  });

  it('excludes undefined/null/empty fields from payload rows', async () => {
    await sendAuditNotification({ ...payload, platform: undefined, contact_preference: '' });
    const html = mockSend.mock.calls[0][0].html as string;
    expect(html).not.toContain('>Platform<');
  });

  it('sends to NOTIFY address from env', async () => {
    await sendAuditNotification(payload);
    expect(mockSend.mock.calls[0][0].to).toBe('admin@test.flexilytics.ai');
  });
});

describe('sendWaitlistConfirmation', () => {
  beforeEach(() => mockSend.mockClear());

  it('sends to correct recipient', async () => {
    await sendWaitlistConfirmation('user@test.com', 'Test User');
    expect(mockSend.mock.calls[0][0].to).toBe('user@test.com');
  });

  it('includes correct subject', async () => {
    await sendWaitlistConfirmation('user@test.com', 'Test');
    expect(mockSend.mock.calls[0][0].subject).toBe("You're on the FlexiAnalyst waitlist");
  });

  it('escapes XSS in name field', async () => {
    await sendWaitlistConfirmation('test@test.com', '<b onmouseover=alert(1)>Name</b>');
    const html = mockSend.mock.calls[0][0].html as string;
    expect(html).not.toContain('<b onmouseover');
    expect(html).toContain('&lt;b');
  });

  it('includes FlexiAnalyst product mention', async () => {
    await sendWaitlistConfirmation('test@test.com', 'User');
    expect(mockSend.mock.calls[0][0].html).toContain('FlexiAnalyst');
  });
});

describe('sendWaitlistNotification', () => {
  beforeEach(() => mockSend.mockClear());

  const payload = {
    name: 'Arjun Ghosh',
    email: 'arjun@flexilytics.ai',
    company: 'Flexilytics',
    role: 'CRO / VP Sales',
  };

  it('sends admin notification for waitlist', async () => {
    await sendWaitlistNotification(payload);
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend.mock.calls[0][0].subject).toContain('Arjun Ghosh');
  });

  it('escapes XSS in all payload fields', async () => {
    await sendWaitlistNotification({
      ...payload,
      name: '<script>evil()</script>',
      company: '<img onerror=alert(1) src=x>',
      role: '"><iframe src=evil.com>',
    });
    const html = mockSend.mock.calls[0][0].html as string;
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img onerror');
    expect(html).not.toContain('<iframe');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&lt;img');
    expect(html).toContain('&lt;iframe');
  });

  it('excludes honeypot from email body', async () => {
    await sendWaitlistNotification({ ...payload, honeypot: '' });
    const html = mockSend.mock.calls[0][0].html as string;
    expect(html).not.toContain('honeypot');
    expect(html).not.toContain('Honeypot');
  });
});
