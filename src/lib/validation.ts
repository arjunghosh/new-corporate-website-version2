import { z } from 'zod';

export const auditSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().min(1).max(100),
  role: z.string().min(1).max(100),
  platform: z.string().optional(),
  challenge: z.string().min(1).max(1000),
  contact_preference: z.enum(['email', 'phone', 'either']).optional(),
  consent: z.literal(true),
  honeypot: z.literal('').optional(),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
  honeypot: z.literal('').optional(),
});

export const waitlistSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().min(1).max(100),
  role: z.string().min(1).max(100),
  honeypot: z.literal('').optional(),
});
