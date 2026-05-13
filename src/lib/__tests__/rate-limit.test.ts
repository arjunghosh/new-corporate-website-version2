import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkRateLimit } from '../rate-limit';

describe('checkRateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows first request', () => {
    expect(checkRateLimit('test-key-1', 5, 60_000)).toBe(true);
  });

  it('allows requests up to the limit', () => {
    const key = 'test-key-limit';
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit(key, 5, 60_000)).toBe(true);
    }
  });

  it('blocks request at limit+1', () => {
    const key = 'test-key-block';
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key, 5, 60_000);
    }
    expect(checkRateLimit(key, 5, 60_000)).toBe(false);
  });

  it('blocks all subsequent requests after limit reached', () => {
    const key = 'test-key-sustained';
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key, 5, 60_000);
    }
    for (let i = 0; i < 10; i++) {
      expect(checkRateLimit(key, 5, 60_000)).toBe(false);
    }
  });

  it('resets after window expires', () => {
    const key = 'test-key-reset';
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key, 5, 60_000);
    }
    expect(checkRateLimit(key, 5, 60_000)).toBe(false);

    vi.advanceTimersByTime(60_001);

    expect(checkRateLimit(key, 5, 60_000)).toBe(true);
  });

  it('different keys are independent', () => {
    const keyA = 'test-independent-a';
    const keyB = 'test-independent-b';
    for (let i = 0; i < 5; i++) {
      checkRateLimit(keyA, 5, 60_000);
    }
    expect(checkRateLimit(keyA, 5, 60_000)).toBe(false);
    expect(checkRateLimit(keyB, 5, 60_000)).toBe(true);
  });

  it('limit=1 blocks on second request', () => {
    const key = 'test-key-limit1';
    expect(checkRateLimit(key, 1, 60_000)).toBe(true);
    expect(checkRateLimit(key, 1, 60_000)).toBe(false);
  });

  it('uses IP-keyed namespace correctly', () => {
    const ip = '192.168.1.100';
    const auditKey = `audit:${ip}`;
    const waitlistKey = `waitlist:${ip}`;
    for (let i = 0; i < 5; i++) {
      checkRateLimit(auditKey, 5, 60_000);
    }
    expect(checkRateLimit(auditKey, 5, 60_000)).toBe(false);
    expect(checkRateLimit(waitlistKey, 5, 60_000)).toBe(true);
  });
});
