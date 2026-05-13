# Flexilytics Corporate Website v2

[![Astro](https://img.shields.io/badge/Astro-4.16-orange.svg)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Auto--deploy-black.svg)](https://vercel.com/)
[![Pages](https://img.shields.io/badge/pages-18_live-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/tests-98_passing-brightgreen.svg)]()
[![Coverage](https://img.shields.io/badge/coverage-100%25_statements-brightgreen.svg)]()
[![Version](https://img.shields.io/badge/version-2.1.0-orange.svg)]()
[![Status](https://img.shields.io/badge/status-Production_Ready-brightgreen.svg)]()
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)

## Executive Summary

### Objective

**Flexilytics Corporate Website v2** is the production Astro 4 rebuild of the Flexilytics company website — replacing a hand-authored static HTML bundle with a maintainable, type-safe, server-capable Astro hybrid site. It preserves 100% visual and content parity with the original design while adding dynamic form handling, database persistence, branded transactional email, and enterprise-grade security headers — all auto-deployed to Vercel on every push to `main`.

### Problem Statement

The v1 static HTML site had several structural limitations:

- **No dynamic forms**: Audit booking, waitlist, and newsletter sign-ups had no backend — leads were lost.
- **No transactional email**: No confirmation or admin notification emails on any form submission.
- **No database**: Zero lead persistence — no way to review who submitted what.
- **Unmaintainable markup**: 18 separate HTML files with duplicated nav, footer, and `<head>` — every global change required editing 18 files.
- **No type safety**: Pure HTML/JS with no build-time checks — regressions were invisible until production.
- **Weak security posture**: No CSP headers, no HSTS, no rate limiting on any endpoint.
- **No SEO infrastructure**: OG images, JSON-LD schemas, and canonical URLs were inconsistent across pages.

### Solution

The v2 Astro rebuild addresses all of these:

- **Shared layout system**: Single `BaseLayout.astro` + `Nav.astro` + `Footer.astro` — one edit, all 18 pages updated.
- **Live API endpoints**: `POST /api/audit`, `/api/newsletter`, `/api/waitlist` — all wired to NeonDB and Resend.
- **Branded HTML emails**: Dark-header template with logo, formatted key-value tables, and plain-text fallback — sent via Resend on every submission.
- **NeonDB persistence**: All leads, newsletter subscribers, and waitlist entries stored in Postgres.
- **Zod validation + honeypot + rate limiting**: Every API endpoint is schema-validated, bot-protected, and IP rate-limited.
- **CSP + HSTS + security headers**: Full header suite enforced via `vercel.json` for all routes.
- **Generated sitemap**: `src/pages/sitemap.xml.ts` generates `/sitemap.xml` at build time from all 18 page URLs.
- **GA4 analytics**: Injected in shared layout, CSP updated to allow GA4/GTM domains.

### Mission Statement

**To present Flexilytics as the definitive Context Engineering firm for regulated enterprise AI — with a website that captures every inbound lead, reflects the brand's precision and credibility, and requires zero manual deployment effort.**

### Vision Statement

**A corporate web presence that operates as infrastructure: auto-deployed, observable, lead-capturing, and maintainable by any developer without touching 18 separate HTML files.**

### Target Personas

#### Primary Users (Who Will Interact With the Site)

| Persona | Role | Interaction | Benefit |
|---------|------|-------------|---------|
| **Enterprise Prospects** | CDOs, CIOs, Heads of Data at regulated firms | Browse solutions, book the 2-Week AI Readiness Audit | Low-friction path from awareness to qualified lead |
| **BFSI Decision-Makers** | RBI/SEBI/IRDAI-regulated orgs | Industries → BFSI page, Trust & Security page | Industry-specific regulatory AI context |
| **Sales Analysts / Data Leaders** | Evaluate FlexiAnalyst product | Solutions → FlexiAnalyst page, join waitlist | Product awareness + captured interest |
| **Flexilytics Team** | Internal ops | Read form submissions via email + NeonDB | All leads in one place, no manual tracking |

#### What the Rebuild Replaces

| Legacy | Problem | Replacement |
|--------|---------|-------------|
| 18 separate HTML files | Any global change = 18 edits | `BaseLayout.astro` shared shell |
| Google Forms / no form | Leads lost, no email confirmation | `/api/audit`, `/api/waitlist`, `/api/newsletter` |
| No email | Prospects got no confirmation | Resend branded HTML email on every submit |
| No DB | Zero lead history | NeonDB `leads` + `waitlist` + `newsletter_subscriptions` |
| No CSP/HSTS | Open to clickjacking, injection | Full header suite in `vercel.json` |

---

## Features

### Core Capabilities

- **18 Static Pages**: All pages pre-rendered at build time via Astro hybrid output — fast CDN delivery, zero runtime cost.
- **3 Live API Endpoints**: SSR routes for form submissions with Zod validation, honeypot bot detection, and in-memory IP rate limiting (5 req/min).
- **NeonDB Lead Persistence**: Every audit booking, waitlist signup, and newsletter subscription saved to Postgres with timestamp and user-agent.
- **Branded Transactional Email**: Dark-header HTML email template (logo, formatted table, CTA button, plain-text companion) sent via Resend on every submission — both user confirmation and admin notification.
- **Admin Email Routing**: Admin notifications CC'd to `ankush.shah@flexilytics.ai`, `hello@flexilytics.ai`, `arjun.ghosh@flexilytics.ai`.
- **Beehiiv Newsletter Integration**: Newsletter API wired — activates on `BEEHIIV_API_KEY` env var. DB-only mode until key received.
- **GA4 Analytics**: Google Analytics 4 injected in shared layout (`G-2VDBBM1YFF`).
- **CSP Security Headers**: Full Content Security Policy including GA4/GTM domains, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy — all via `vercel.json`.
- **Generated Sitemap**: `/sitemap.xml` generated at Astro build time from 19 routes with weighted priorities.
- **SEO / AEO / GEO**: Every page ships canonical URL, Open Graph (1200×630 OG images), Twitter card, geo meta (Mumbai), JSON-LD (`Organization` + `WebSite` + page-typed node + `BreadcrumbList`). `FAQPage` schema on home/approach/context-engineering/book-audit. `Article` + `Person` schema on insight articles.
- **robots.txt**: Explicitly allows GPTBot, ClaudeBot, anthropic-ai, Google-Extended, PerplexityBot, Applebot-Extended, CCBot, Bytespider, meta-externalagent.
- **Unit Test Suite**: 98 tests across 4 files — Zod schema validation, rate-limiter window logic, email XSS escaping, CSP header assertions, form injection attack coverage. 100% statement/function/line coverage on all unit-testable lib files. Run via `npm run test` or `npm run test:coverage`.

### Integrations and Stack

- **Astro 4.16** — hybrid output, `@astrojs/vercel` serverless adapter, TypeScript strict mode
- **NeonDB (Serverless Postgres)** — `@neondatabase/serverless`, `leads` + `waitlist` + `newsletter_subscriptions` tables
- **Resend** — transactional email, sender domain `notify.flexilytics.ai`
- **Beehiiv** — newsletter subscription sync (API key pending)
- **GA4 / Google Tag Manager** — analytics via `G-2VDBBM1YFF`
- **Zod** — schema validation on all 3 API endpoints
- **Vitest + @vitest/coverage-v8** — unit test suite (98 tests, 100% statement coverage on lib layer)
- **Vercel** — auto-deploy on push to `main`, Node 20.x runtime, CSP headers

---

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Architecture](#architecture)
- [Pages](#pages)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Documentation](#documentation)
- [Git Tags and Releases](#git-tags-and-releases)
- [Status](#status)

---

## Installation

### Prerequisites

- **Node.js 20+**
- **npm 10+**
- **git**
- NeonDB connection string (for API routes)
- Resend API key (for transactional email)

### Install from Source

```bash
git clone https://github.com/arjunghosh/new-corporate-website-version2.git
cd new-corporate-website-version2

npm install

# Copy env template and fill in credentials
cp .env.example .env.local
# Edit .env.local with your values
```

### Start Dev Server

```bash
npm run dev
# → http://localhost:4321
```

### Verify Build

```bash
npm run build   # must complete with 0 errors
npm run check   # TypeScript — must be 0 errors, 0 warnings
```

---

## Configuration

### Environment Variables

All configuration is environment-variable driven. Copy `.env.example` to `.env.local` and fill in values. Never commit `.env.local`.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | NeonDB PostgreSQL connection string |
| `RESEND_API_KEY` | ✅ | Resend API key for transactional email |
| `RESEND_SENDER_EMAIL` | ✅ | Sender address (e.g. `no-reply@notify.flexilytics.ai`) |
| `LEAD_NOTIFY_EMAIL` | ✅ | Primary recipient for admin lead notifications |
| `ADMIN_CC_EMAILS` | ✅ | CC recipients — comma-separated or JSON array |
| `BEEHIIV_PUBLICATION_ID` | ✅ | Beehiiv publication ID for newsletter sync |
| `BEEHIIV_API_KEY` | pending | Beehiiv API key — DB-only mode until set |
| `GA4_MEASUREMENT_ID` | ✅ | Google Analytics 4 measurement ID |
| `IP_HASH_SALT` | ✅ | Random hex string for IP hashing in rate limiter |
| `PUBLIC_SITE_URL` | ✅ | Canonical site URL for sitemap and OG tags |

### Vercel Environment (Production)

All 9 env vars above are set on the `new-corporate-website-version2` Vercel project for production, preview, and development environments. Set via Vercel dashboard → Project Settings → Environment Variables.

Production email routing:
- `LEAD_NOTIFY_EMAIL` = `hello@flexilytics.ai`
- `ADMIN_CC_EMAILS` = `ankush.shah@flexilytics.ai,hello@flexilytics.ai,arjun.ghosh@flexilytics.ai`

---

## Usage

### Application Access

| Environment | URL |
|---|---|
| **Production** | `https://new-corporate-website-version2.vercel.app` |
| **Local Dev** | `http://localhost:4321` |

### Deploy

```bash
# Auto-deploy (recommended)
git push origin main   # Vercel picks up and deploys automatically

# Manual
vercel --prod
```

### Post-Deploy Self-Test

After every push, verify on the production alias (not hash URL — Vercel SSO blocks hash URLs):

```
https://new-corporate-website-version2.vercel.app
```

Check: all pages load, 0 console errors, forms submit successfully, branded email received.

---

## Architecture

### System Overview

```
Browser
  │
  ├── Static pages (18) ──── Vercel CDN (pre-rendered at build)
  │
  └── API routes (3) ──────► Vercel Serverless Function (Node 20.x)
                                │
                                ├── Zod validation
                                ├── Honeypot check
                                ├── IP rate limit (in-memory)
                                ├── NeonDB (Postgres) ──► leads / waitlist / newsletter_subscriptions
                                └── Resend ──────────────► Branded HTML email (user + admin)
                                          └── Beehiiv ──► Newsletter sync (API key pending)
```

### Astro Hybrid Architecture

- **Static (pre-rendered)**: All 18 public pages — `index.astro`, `about.astro`, `leadership.astro`, `insights.astro`, all solutions/platforms/industries pages. Built at deploy time, served from CDN.
- **SSR (server-rendered)**: `src/pages/api/*.ts` — 3 API routes with `export const prerender = false`. Run as Vercel serverless functions.
- **Adapter**: `@astrojs/vercel` serverless — Node 20.x runtime enforced via `engines.node` in `package.json`.

### Technology Stack

| Layer | Technology |
|---|---|
| Framework | Astro 4.16, TypeScript strict |
| Adapter | @astrojs/vercel serverless |
| Database | NeonDB (Serverless Postgres) via @neondatabase/serverless |
| Email | Resend SDK — branded HTML + plain text |
| Validation | Zod — schema on all 3 API routes |
| Security | CSP + HSTS + X-Frame-Options + Referrer-Policy + Permissions-Policy (vercel.json) |
| Analytics | GA4 via GTM script in BaseLayout |
| Newsletter | Beehiiv REST API v2 |
| Deploy | Vercel — auto-deploy on push to `main` |
| Node runtime | 20.x (pinned in package.json `engines`) |

### Database Schema (NeonDB)

```sql
-- Audit form submissions
leads (
  id SERIAL PRIMARY KEY,
  kind TEXT NOT NULL,            -- 'audit'
  payload JSONB,                 -- full form data
  source_page TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- FlexiAnalyst waitlist
waitlist (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  company TEXT,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Newsletter subscriptions
newsletter_subscriptions (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

---

## Pages

All 18 public pages live at clean URLs (no `.html` extension). All return HTTP 200 in production.

| Page | Clean URL | Astro File |
|---|---|---|
| Homepage | `/` | `src/pages/index.astro` |
| Approach | `/approach` | `src/pages/approach.astro` |
| Context Engineering | `/context-engineering` | `src/pages/context-engineering.astro` |
| Solutions Hub | `/solutions` | `src/pages/solutions.astro` |
| Data Governance | `/solutions-data-governance` | `src/pages/solutions-data-governance.astro` |
| Modern Data Platform | `/solutions-modern-data-platform` | `src/pages/solutions-modern-data-platform.astro` |
| AI/ML Engineering | `/solutions-ai-ml-engineering` | `src/pages/solutions-ai-ml-engineering.astro` |
| Analytics & BI | `/solutions-analytics-bi` | `src/pages/solutions-analytics-bi.astro` |
| FlexiAnalyst | `/solutions-flexianalyst` | `src/pages/solutions-flexianalyst.astro` |
| Platforms | `/platforms` | `src/pages/platforms.astro` |
| Trust & Security | `/trust-security` | `src/pages/trust-security.astro` |
| Insights Hub | `/insights` | `src/pages/insights.astro` |
| Article — Context Engineering | `/insights/context-engineering-buyable-category` | `src/pages/insights/context-engineering-buyable-category.astro` |
| Article — Fabric vs Databricks | `/insights/fabric-vs-databricks-bfsi` | `src/pages/insights/fabric-vs-databricks-bfsi.astro` |
| About | `/about` | `src/pages/about.astro` |
| Leadership | `/leadership` | `src/pages/leadership.astro` |
| BFSI Industry | `/industries/bfsi` | `src/pages/industries/bfsi.astro` |
| Book Audit | `/book-audit` | `src/pages/book-audit.astro` |
| Sitemap | `/sitemap.xml` | `src/pages/sitemap.xml.ts` |

---

## API Endpoints

| Route | Method | Purpose | DB table | Email sent |
|---|---|---|---|---|
| `/api/audit` | POST | Book the 2-Week AI Readiness Audit | `leads` | User confirmation + admin notification |
| `/api/newsletter` | POST | Insights newsletter subscribe | `newsletter_subscriptions` + Beehiiv | — |
| `/api/waitlist` | POST | FlexiAnalyst waitlist signup | `waitlist` | User confirmation + admin notification |

All endpoints: Zod schema validation → honeypot check → IP rate limit (5 req / 60s) → DB insert → email via `Promise.allSettled`.

---

## Development

### Project Structure

```
corporate-website-v2/
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro          # Shared HTML shell — nav, footer, GA4, SEO, JSON-LD slots
│   ├── components/
│   │   ├── Nav.astro                 # Top navigation bar
│   │   ├── Footer.astro             # Site footer
│   │   ├── SEO.astro                # Typed meta / OG / Twitter / geo tags
│   │   └── JsonLd.astro             # JSON-LD script injector
│   ├── data/
│   │   ├── site.ts                  # Org constants (name, URL, tagline, address, team)
│   │   ├── navigation.ts            # Nav link definitions
│   │   └── team.ts                  # Founder data
│   ├── lib/
│   │   ├── db.ts                    # NeonDB: insertLead, insertNewsletterSub, insertWaitlist
│   │   ├── email.ts                 # Resend: branded HTML templates for all 4 email types
│   │   ├── validation.ts            # Zod schemas: auditSchema, newsletterSchema, waitlistSchema
│   │   ├── rate-limit.ts            # In-memory IP rate limiter
│   │   └── __tests__/               # Unit tests (Vitest)
│   │       ├── validation.test.ts   # 40+ tests: schema shape, consent, honeypot, type coercion
│   │       ├── rate-limit.test.ts   # 8 tests: window reset, key isolation (fake timers)
│   │       ├── email.test.ts        # 30+ tests: XSS escaping, honeypot exclusion, routing
│   │       └── security.test.ts     # 30+ tests: CSP headers, form injection, robots.txt
│   └── pages/
│       ├── api/
│       │   ├── audit.ts             # POST /api/audit
│       │   ├── newsletter.ts        # POST /api/newsletter
│       │   └── waitlist.ts          # POST /api/waitlist
│       ├── industries/
│       │   └── bfsi.astro           # /industries/bfsi
│       ├── insights/
│       │   ├── context-engineering-buyable-category.astro
│       │   └── fabric-vs-databricks-bfsi.astro
│       ├── index.astro              # Homepage (reads index.html at build time)
│       ├── about.astro
│       ├── approach.astro
│       ├── book-audit.astro
│       ├── context-engineering.astro
│       ├── insights.astro
│       ├── leadership.astro
│       ├── platforms.astro
│       ├── solutions.astro
│       ├── solutions-*.astro        # 5 solution sub-pages
│       ├── trust-security.astro
│       └── sitemap.xml.ts           # Generated sitemap
├── assets/                          # Symlinked into public/ at build
│   ├── site.css                     # Design system v4 (CSS custom properties)
│   ├── site.js                      # Nav, reveal animations, ambient canvas
│   ├── logo-full-nav.png            # Nav logo (1941×409px transparent, incl. tagline)
│   ├── logo-footer.png              # Footer logo (grey-toned variant)
│   └── team/                        # Founder portrait photos
├── og/                              # OG social preview images (1200×630px, one per page)
├── public/
│   ├── favicon.ico                  # Multi-size ICO (16/32/48px)
│   └── robots.txt                   # AI crawlers explicitly allowed
├── *.html                           # Original static HTML — parity reference, do not delete
├── astro.config.mjs                 # output: hybrid, Vercel adapter, trailingSlash: never
├── tsconfig.json                    # Strict mode, path alias @/*
├── vercel.json                      # cleanUrls, security headers (CSP, HSTS, X-Frame-Options)
├── vitest.config.ts                 # Test config: node env, import.meta.env stubs, coverage scope
└── package.json                     # engines: node 20.x, test/coverage scripts
```

### Key Conventions

- `type="email"` inputs use browser-native validation only — do NOT add `pattern` attribute (Astro strips `\s` in attribute strings).
- All API responses follow `{ ok: true }` (202) or `{ error: string }` (4xx/5xx) envelope.
- `Promise.allSettled` on all email sends — DB insert failure throws, email failure is logged and swallowed.
- `src/pages/index.astro` reads `index.html` at build time via `readFile` — extracts `<main>`, tweaks panel, foot script via regex. Changing the homepage layout requires editing `index.html`, not `index.astro`.

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev server at `http://localhost:4321` |
| `npm run build` | Production build — must pass before any deploy |
| `npm run check` | TypeScript check — 0 errors, 0 warnings required |
| `npm run test` | Run all 98 unit tests (Vitest) |
| `npm run test:watch` | Vitest watch mode for TDD |
| `npm run test:coverage` | Generate v8 coverage report (`coverage/` dir) |
| `git push origin main` | Triggers Vercel auto-deploy |

---

## Contributing

Proprietary. Internal development only.

- Never commit `.env.local` or any file containing credentials.
- Run `npm run build && npm run check` before pushing — both must be clean.
- After every push, self-test on `https://new-corporate-website-version2.vercel.app` (not hash URLs).
- Do not add `pattern` attributes to `type="email"` inputs — use browser native validation.
- All new form fields must be added to both the Zod schema (`src/lib/validation.ts`) and the API route payload.

---

## License

Proprietary software owned by **Flexilytics Private Limited**. All rights reserved.

Unauthorized copying, modification, distribution, or use of this software in any form is strictly prohibited. For licensing enquiries contact Ankush Shah.

---

## Acknowledgments

- **Arjun Ghosh** (Chief AI & Tech Officer) — Architecture, development, deployment
- **Ankush Shah** (CEO & Founder) — Product direction, brand, content
- **Flexilytics Private Limited** — Organization

---

## Documentation

- [CHANGES.md](CHANGES.md) — Rolling session log + CEO update material (gitignored, local only)
- [src/lib/schema.sql](src/lib/schema.sql) — NeonDB live schema DDL
- [vercel.json](vercel.json) — CSP + security headers reference

### Design Reference

Parity baseline: `new-designdocs-part-2/deploy/` — original static HTML/CSS/JS bundle. Every Astro page must match this reference visually and structurally. Exception: logos and favicon use the re-created assets in this repo, not the originals.

---

## Git Tags and Releases

| Tag | Date | Description |
|---|---|---|
| `v2.1.0` | 2026-05-13 | **Test suite** — 98 unit tests (Vitest). Covers Zod schemas, rate-limiter, email XSS escaping, CSP headers, form injection attacks, robots.txt AI crawler access. 100% statement/function/line coverage on all unit-testable lib files. |
| `v2.0.0` | 2026-05-13 | **Production launch** — Full Astro 4 hybrid rebuild. 18 pages, 3 API endpoints, NeonDB persistence, branded Resend HTML email, GA4, CSP security headers, generated sitemap. All 19 routes HTTP 200. Zero console errors. Both forms E2E tested and confirmed DB-saving. |

### Commit History

| Commit | Description |
|---|---|
| `06eaf63` | fix: coverage config — exclude legacy-page.ts, schema.sql, api routes from unit coverage scope |
| `e9f185b` | feat: add unit test suite — 98 tests (validation, rate-limit, email XSS, security headers) |
| `20ec0c5` | docs: update README to v2.0.0 production state + tighten gitignore |
| `68c3f3e` | chore: flip email routing to production addresses |
| `fc04f6c` | chore: trigger redeploy to pick up new Vercel env vars |
| `0f20df8` | fix: book-audit email pattern attribute stripping `\s` — removed, native validation sufficient |
| `dbe52ce` | feat: replace bare email stubs with full branded HTML template system |
| `edb73f4` | fix: inject tweaks panel HTML into homepage foot slot — eliminates null addEventListener TypeError |
| `a9c3b4f` | fix: add GA4/GTM domains to CSP connect-src |
| `bd815bf` | fix: add engines.node=20.x — Vercel adapter incompatible with Node 24 |
| `ca357a8` | fix: remove TWEAK_DEFAULTS from BaseLayout — eliminates duplicate const declaration |
| `12d784f` | fix: pre-deploy bug fixes — path resolution, error handling, rewrites cleanup |
| `648a4a9` | feat: all 18 pages converted to Astro, forms wired, GA4, sitemap, rate-limit, security headers |
| `ab139ae` | chore: Astro scaffold + NeonDB wiring |

---

## Pre-Launch Open Items

| Item | Priority | Notes |
|---|---|---|
| Beehiiv API key | P1 | Newsletter DB-only until key received. Add `BEEHIIV_API_KEY` Vercel env var. Code already handles it. |
| Domain cutover | P0 | Point `flexilytics.ai` DNS to this Vercel project. |
| Google Search Console | P2 | Submit `/sitemap.xml` after domain go-live. |
| Replace `assets/team/arun.png` | P3 | Non-standardised portrait — replace with square white-bg photo before launch. |

---

## Status

- **Version**: 2.1.0
- **Status**: Production ready — live at `https://new-corporate-website-version2.vercel.app`
- **Pages**: 18 static + 1 sitemap, all HTTP 200
- **Forms**: All 3 API endpoints tested E2E — DB saves confirmed
- **Console errors**: 0
- **Tests**: 98/98 passing (`npm run test`) | 100% statement/function/line coverage on lib layer
- **Build**: `npm run build` ✅ | `npm run check` ✅ 0 errors, 0 warnings
- **Node runtime**: 20.x (Vercel + local enforced)
- **License**: Proprietary — All Rights Reserved
- **Owner**: Flexilytics Private Limited

---

**Built by Arjun Ghosh (CAIO) for Flexilytics Private Limited. Product direction by Ankush Shah (CEO). © 2026.**
