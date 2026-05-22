# Flexilytics Corporate Website v2

[![Astro](https://img.shields.io/badge/Astro-4.16-orange.svg)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Auto--deploy-black.svg)](https://vercel.com/)
[![Pages](https://img.shields.io/badge/pages-20_live-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/tests-103_passing-brightgreen.svg)]()
[![Coverage](https://img.shields.io/badge/coverage-100%25_statements-brightgreen.svg)]()
[![Version](https://img.shields.io/badge/version-3.0.1-orange.svg)]()
[![Status](https://img.shields.io/badge/status-Production_Live-brightgreen.svg)]()
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)

## Executive Summary

### Objective

**Flexilytics Corporate Website v2** is the production Astro 4 rebuild of the Flexilytics company website — replacing a hand-authored static HTML bundle with a maintainable, type-safe, server-capable Astro hybrid site. It preserves 100% visual parity with the new design (Ankush Shah v3.0 redesign) while adding dynamic form handling, database persistence, branded transactional email, enterprise-grade security headers, full SEO/AEO/GEO infrastructure, and LLM discoverability — all auto-deployed to Vercel on every push to `main`.

**Live at:** `https://www.flexilytics.ai`

### Problem Statement

The v1 static HTML site had several structural limitations:

- **No dynamic forms**: Audit booking, waitlist, and newsletter sign-ups had no backend — leads were lost.
- **No transactional email**: No confirmation or admin notification emails on any form submission.
- **No database**: Zero lead persistence — no way to review who submitted what.
- **Unmaintainable markup**: 18 separate HTML files with duplicated nav, footer, and `<head>` — every global change required editing 18 files.
- **No type safety**: Pure HTML/JS with no build-time checks — regressions were invisible until production.
- **Weak security posture**: No CSP headers, no HSTS, no rate limiting on any endpoint.
- **Broken SEO infrastructure**: Canonical URLs, OG images, and JSON-LD schemas pointed to staging (`.vercel.app`) instead of `www.flexilytics.ai`. No LLM context files. No HowTo or Person schemas.

### Solution

The v2 Astro rebuild addresses all of these:

- **Shared layout system**: Single `BaseLayout.astro` + `Nav.astro` + `Footer.astro` — one edit, all pages updated.
- **Live API endpoints**: `POST /api/audit`, `/api/newsletter`, `/api/waitlist` — all wired to NeonDB and Resend.
- **Branded HTML emails**: Dark-header template with logo, formatted key-value tables, and plain-text fallback — sent via Resend on every submission.
- **NeonDB persistence**: All leads, newsletter subscribers, and waitlist entries stored in Postgres.
- **Zod validation + honeypot + rate limiting**: Every API endpoint is schema-validated, bot-protected, and IP rate-limited.
- **CSP + HSTS + security headers**: Full header suite enforced via `vercel.json` for all routes.
- **Full SEO/AEO/GEO stack**: Canonical URLs (`https://www.flexilytics.ai`), per-page OG images, JSON-LD (Organization, WebSite, WebPage, BreadcrumbList, FAQPage, HowTo, Person), geo meta (Mumbai), robots.txt with 11 AI crawlers explicitly welcomed.
- **LLM discoverability**: `llms.txt` (concise) and `llms-full.txt` (10-section, ~3KB) for AI answer engine context.
- **IndexNow**: Key file live, 18 URLs submitted to Bing/Yandex IndexNow network.
- **CEO-requested content updates**: Disambiguation copy (Not FlexAI), founder credential enrichment, Two-Week Audit HowTo schema.
- **GA4 analytics**: Injected in shared layout, CSP updated to allow GA4/GTM domains.

### Mission Statement

**To present Flexilytics as the definitive Context Engineering firm for regulated enterprise AI — with a website that captures every inbound lead, is discoverable by LLMs and AI answer engines, reflects the brand's precision and credibility, and requires zero manual deployment effort.**

### Target Personas

#### Primary Users (Who Will Interact With the Site)

| Persona | Role | Interaction | Benefit |
|---------|------|-------------|---------|
| **Enterprise Prospects** | CDOs, CIOs, Heads of Data at regulated firms | Browse solutions, book the 2-Week AI Readiness Audit | Low-friction path from awareness to qualified lead |
| **BFSI Decision-Makers** | RBI/SEBI/IRDAI-regulated orgs | Industries → BFSI page, Trust & Security page | Industry-specific regulatory AI context |
| **Sales Analysts / Data Leaders** | Evaluate FlexiAnalyst product | Solutions → FlexiAnalyst page, join waitlist | Product awareness + captured interest |
| **AI Answer Engines** | GPT, Claude, Perplexity, Gemini | `llms.txt`, `llms-full.txt`, JSON-LD schemas | Accurate Flexilytics representation in AI-generated answers |
| **Flexilytics Team** | Internal ops | Read form submissions via email + NeonDB | All leads in one place, no manual tracking |

---

## Features

### Core Capabilities

- **20 Pages / Routes**: 18 public pages + `sitemap.xml` + `llms.txt` + `llms-full.txt` — all pre-rendered at build time via Astro hybrid output.
- **3 Live API Endpoints**: SSR routes for form submissions with Zod validation, honeypot bot detection, and IP rate limiting (5 req/min).
- **NeonDB Lead Persistence**: Every audit booking, waitlist signup, and newsletter subscription saved to Postgres with timestamp and user-agent.
- **Branded Transactional Email**: Dark-header HTML email template sent via Resend on every submission — both user confirmation and admin notification.
- **Full SEO / AEO / GEO Stack**:
  - Canonical URL: `https://www.flexilytics.ai` on every page (fixed from staging URL leak)
  - OG images: per-page 1200×630px images (`/og/*.png`)
  - JSON-LD schemas: `Organization`, `WebSite`, `WebPage`, `BreadcrumbList`, `FAQPage` on every qualifying page
  - `HowTo` schema: Two-Week Readiness Audit (3 steps, P14D) on `/approach`
  - `Person` schemas: All 4 founding partners on `/leadership` with `alumniOf`, `knowsAbout`, `sameAs` (LinkedIn)
  - Geo meta: `IN-MH`, Mumbai, ICBM coordinates on every page
- **LLM Context Files**:
  - `/llms.txt`: Concise AI context (~900 chars) — identity, framework, team, pages
  - `/llms-full.txt`: Full 10-section context (~3KB) — complete entity description for AI answer engines
- **IndexNow**: Key file live at `/00d6af46d60a454eb2b84a57ed974c79.txt`. 18 URLs submitted (HTTP 200 accepted).
- **robots.txt**: 11 AI crawlers explicitly welcomed: GPTBot, ClaudeBot, anthropic-ai, ChatGPT-User, Google-Extended, PerplexityBot, Applebot-Extended, CCBot, Bytespider, meta-externalagent, YouBot, cohere-ai.
- **CEO Content Updates (v3.0.0)**:
  - "Not FlexAI" disambiguation in About → Why We Exist section
  - Footer disambiguation: "Flexilytics is a Context Engineering consultancy — not FlexAI, not an AI product company."
  - New design UI: full mobile/responsive optimisation across all breakpoints
  - Accurate brand favicon (Flexilytics brand teal-F logo)
- **Unit Test Suite**: 103 tests across 4 files (Vitest). Covers Zod schemas, rate-limiter, email XSS escaping, CSP headers, form injection attacks. 100% statement/function/line coverage on all unit-testable lib files.

### Integrations and Stack

- **Astro 4.16** — hybrid output, `@astrojs/vercel` serverless adapter (`nodeVersion: '20'`), TypeScript strict mode
- **NeonDB (Serverless Postgres)** — `@neondatabase/serverless`, `leads` + `waitlist` + `newsletter_subscriptions` tables
- **Resend** — transactional email, sender domain `notify.flexilytics.ai`
- **Beehiiv** — newsletter subscription sync (API key pending)
- **GA4 / Google Tag Manager** — analytics via `G-2VDBBM1YFF`
- **IndexNow** — key `00d6af46d60a454eb2b84a57ed974c79`, 18 production URLs submitted
- **Zod** — schema validation on all 3 API endpoints
- **Vitest + @vitest/coverage-v8** — unit test suite (103 tests, 100% statement coverage on lib layer)
- **Vercel** — project `new-corporate-website-version2` (`prj_5ocS7Xo1u1OKJWHMVmnN2uzz8S16`), Node 20.x runtime, CSP headers, custom domain `www.flexilytics.ai`

---

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Architecture](#architecture)
- [Pages](#pages)
- [API Endpoints](#api-endpoints)
- [SEO and AEO Infrastructure](#seo-and-aeo-infrastructure)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)
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
npm run build     # must complete with 0 errors
npm run typecheck # TypeScript — must be 0 errors
npm run test      # 103 tests must pass
```

---

## Configuration

### Environment Variables

All configuration is environment-variable driven. Copy `.env.example` to `.env.local` and fill in values. Never commit `.env.local`.

| Variable | Required | Description |
|---|---|---|
| `PUBLIC_SITE_URL` | ✅ | Canonical site URL — **must be `https://www.flexilytics.ai`** (with www) |
| `DATABASE_URL` | ✅ | NeonDB PostgreSQL connection string |
| `RESEND_API_KEY` | ✅ | Resend API key for transactional email |
| `RESEND_SENDER_EMAIL` | ✅ | Sender address (e.g. `no-reply@notify.flexilytics.ai`) |
| `LEAD_NOTIFY_EMAIL` | ✅ | Primary recipient for admin lead notifications |
| `ADMIN_CC_EMAILS` | ✅ | CC recipients — comma-separated |
| `BEEHIIV_PUBLICATION_ID` | ✅ | Beehiiv publication ID for newsletter sync |
| `BEEHIIV_API_KEY` | pending | Beehiiv API key — DB-only mode until set |
| `GA4_MEASUREMENT_ID` | ✅ | Google Analytics 4 measurement ID |
| `IP_HASH_SALT` | ✅ | Random hex string for IP hashing in rate limiter |

> **Critical:** `PUBLIC_SITE_URL` must use the `www` subdomain. Non-www causes canonical/OG/sitemap URLs to diverge from the production domain. `src/data/site.ts` is the authoritative URL — keep it in sync.

### Vercel Project (Production)

- **Project name**: `new-corporate-website-version2`
- **Project ID**: `prj_5ocS7Xo1u1OKJWHMVmnN2uzz8S16`
- **Org**: `arjun-ghoshs-projects` (team `team_EHreeMT1SqlaWSL25Rzh9vQT`)
- **Custom domain**: `www.flexilytics.ai` (owns domain — auto-deploys on every `git push origin main`)
- **Project alias**: `https://new-corporate-website-version2.vercel.app`
- **Node runtime**: 20.x (enforced via `astro.config.mjs` `nodeVersion: '20'` + `package.json` `engines.node`)
- **`.vercel/project.json`**: gitignored — run `vercel link --project new-corporate-website-version2` on fresh clone

> **Note:** `flexilytics-corporate-v2` (`prj_8XYeFadepmDhHPMgeKZulneP6en6`) was an orphaned Vercel project with no domain and no production deployment. It was deleted 2026-05-22. All references to it in earlier docs/memory are stale.

Production email routing:
- `LEAD_NOTIFY_EMAIL` = `hello@flexilytics.ai`
- `ADMIN_CC_EMAILS` = `ankush.shah@flexilytics.ai,hello@flexilytics.ai,arjun.ghosh@flexilytics.ai`

---

## Usage

### Application Access

| Environment | URL |
|---|---|
| **Production** | `https://www.flexilytics.ai` |
| **Vercel project alias** | `https://new-corporate-website-version2.vercel.app` |
| **Local Dev** | `http://localhost:4321` |

### Deploy (Primary — Git Auto-Deploy)

The Vercel project `new-corporate-website-version2` is git-connected to `arjunghosh/new-corporate-website-version2` (`origin`). Every push to `main` triggers an automatic build and deployment to `www.flexilytics.ai` — no manual steps needed.

```bash
git push origin main   # Vercel auto-builds and deploys → www.flexilytics.ai updated (~60s)
```

### Deploy (Fallback — Manual Prebuilt)

Only needed if git auto-deploy is blocked. Requires `.vercel/project.json` to point at `new-corporate-website-version2` (run `vercel link --project new-corporate-website-version2` on fresh clone).

```bash
# 1. Build (generates .vercel/output/)
npm run build

# 2. Deploy prebuilt output
vercel deploy --prebuilt --prod
```

> **Node runtime note:** The Astro adapter generates `nodejs18.x` in `.vercel/output/functions/_render.func/.vc-config.json` if `nodeVersion` is not set. The `astro.config.mjs` adapter config includes `nodeVersion: '20'` to override this. If you upgrade the adapter, verify `.vc-config.json` still shows `nodejs20.x` before deploying.

### Post-Deploy Verification Checklist

After every deploy, confirm:

```bash
# 1. Canonical URL correct (must be www.flexilytics.ai, NOT *.vercel.app)
curl -s https://www.flexilytics.ai | grep 'canonical'

# 2. llms.txt serving correctly
curl -s https://www.flexilytics.ai/llms.txt | head -5

# 3. Sitemap URLs are www
curl -s https://www.flexilytics.ai/sitemap.xml | grep '<loc>' | head -3

# 4. IndexNow key file accessible
curl https://www.flexilytics.ai/00d6af46d60a454eb2b84a57ed974c79.txt
```

---

## Architecture

### System Overview

```
Browser / AI Answer Engine
  │
  ├── Static pages (18) ──────── Vercel CDN (pre-rendered at build)
  ├── /llms.txt ────────────────► Vercel CDN (static, AI context)
  ├── /llms-full.txt ──────────► Vercel CDN (static, AI context)
  ├── /sitemap.xml ────────────► Vercel CDN (static, generated at build)
  │
  └── API routes (3) ──────────► Vercel Serverless Function (Node 20.x)
                                    │
                                    ├── Zod validation
                                    ├── Honeypot check
                                    ├── IP rate limit (in-memory, 5 req/60s)
                                    ├── NeonDB (Postgres) ──► leads / waitlist / newsletter_subscriptions
                                    └── Resend ──────────────► Branded HTML email (user + admin)
                                              └── Beehiiv ──► Newsletter sync (API key pending)
```

### Astro Hybrid Architecture

- **Static (pre-rendered)**: All 18 public pages + sitemap + llms.txt + llms-full.txt. Built at deploy time, served from CDN.
- **SSR (server-rendered)**: `src/pages/api/*.ts` — 3 API routes with `export const prerender = false`. Run as Vercel serverless functions.
- **HTML-source pattern**: Every `.astro` page (e.g. `index.astro`) reads its matching `.html` file from the repo root at build time, normalises `https://flexilytics.ai` → `site.url`, extracts schemas, styles, and `<main>` content, then injects into `BaseLayout.astro`. The `.html` files are the canonical content source — edit them, not the `.astro` wrappers.
- **Adapter**: `@astrojs/vercel` serverless — Node 20.x runtime enforced via `nodeVersion: '20'` in adapter config and `engines.node` in `package.json`.

### Technology Stack

| Layer | Technology |
|---|---|
| Framework | Astro 4.16, TypeScript strict |
| Adapter | @astrojs/vercel serverless, nodeVersion: 20 |
| Database | NeonDB (Serverless Postgres) via @neondatabase/serverless |
| Email | Resend SDK — branded HTML + plain text |
| Validation | Zod — schema on all 3 API routes |
| Security | CSP + HSTS + X-Frame-Options + Referrer-Policy + Permissions-Policy (vercel.json) |
| Analytics | GA4 via GTM script in BaseLayout |
| Newsletter | Beehiiv REST API v2 |
| SEO | Canonical meta, OG/Twitter tags, JSON-LD (Organization/WebSite/WebPage/BreadcrumbList/FAQPage/HowTo/Person) |
| AEO/GEO | llms.txt, llms-full.txt, IndexNow, AI-crawler robots.txt |
| Deploy | Vercel — git auto-deploy (`git push origin main`), fallback: `vercel deploy --prebuilt --prod` |
| Node runtime | 20.x (pinned via adapter + package.json engines) |

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

| Page | Clean URL | Source File |
|---|---|---|
| Homepage | `/` | `index.html` → `src/pages/index.astro` |
| Approach | `/approach` | `approach.html` → `src/pages/approach.astro` |
| Context Engineering | `/context-engineering` | `context-engineering.html` → `src/pages/context-engineering.astro` |
| Solutions Hub | `/solutions` | `solutions.html` → `src/pages/solutions.astro` |
| Data Governance | `/solutions-data-governance` | `solutions-data-governance.html` → `src/pages/solutions-data-governance.astro` |
| Modern Data Platform | `/solutions-modern-data-platform` | `solutions-modern-data-platform.html` → `src/pages/solutions-modern-data-platform.astro` |
| AI/ML Engineering | `/solutions-ai-ml-engineering` | `solutions-ai-ml-engineering.html` → `src/pages/solutions-ai-ml-engineering.astro` |
| Analytics & BI | `/solutions-analytics-bi` | `solutions-analytics-bi.html` → `src/pages/solutions-analytics-bi.astro` |
| FlexiAnalyst | `/solutions-flexianalyst` | `solutions-flexianalyst.html` → `src/pages/solutions-flexianalyst.astro` |
| Platforms | `/platforms` | `platforms.html` → `src/pages/platforms.astro` |
| Trust & Security | `/trust-security` | `trust-security.html` → `src/pages/trust-security.astro` |
| Insights Hub | `/insights` | `insights.html` → `src/pages/insights.astro` |
| Article — Context Engineering | `/insights/context-engineering-buyable-category` | `src/pages/insights/context-engineering-buyable-category.astro` |
| Article — Fabric vs Databricks | `/insights/fabric-vs-databricks-bfsi` | `src/pages/insights/fabric-vs-databricks-bfsi.astro` |
| About | `/about` | `about.html` → `src/pages/about.astro` |
| Leadership | `/leadership` | `leadership.html` → `src/pages/leadership.astro` |
| BFSI Industry | `/industries/bfsi` | `bfsi.html` → `src/pages/industries/bfsi.astro` |
| Book Audit | `/book-audit` | `book-audit.html` → `src/pages/book-audit.astro` |
| Sitemap | `/sitemap.xml` | `src/pages/sitemap.xml.ts` |
| LLM Context (short) | `/llms.txt` | `src/pages/llms.txt.ts` |
| LLM Context (full) | `/llms-full.txt` | `src/pages/llms-full.txt.ts` |
| IndexNow key | `/00d6af46d60a454eb2b84a57ed974c79.txt` | `public/00d6af46d60a454eb2b84a57ed974c79.txt` |

---

## API Endpoints

| Route | Method | Purpose | DB table | Email sent |
|---|---|---|---|---|
| `/api/audit` | POST | Book the 2-Week AI Readiness Audit | `leads` | User confirmation + admin notification |
| `/api/newsletter` | POST | Insights newsletter subscribe | `newsletter_subscriptions` + Beehiiv | — |
| `/api/waitlist` | POST | FlexiAnalyst waitlist signup | `waitlist` | User confirmation + admin notification |

All endpoints: Zod schema validation → honeypot check → IP rate limit (5 req / 60s) → DB insert → email via `Promise.allSettled`.

---

## SEO and AEO Infrastructure

### JSON-LD Schemas (per page)

| Page | Schemas |
|---|---|
| All pages | `Organization`, `WebSite`, typed `WebPage` node, `BreadcrumbList` |
| `/` | + `FAQPage` (4 questions) |
| `/approach` | + `FAQPage` (2 questions), `HowTo` (Two-Week Readiness Audit, 3 steps, P14D) |
| `/context-engineering` | + `FAQPage` |
| `/book-audit` | + `FAQPage` |
| `/leadership` | + 4× `Person` (Ankush Shah, Vishal Dhure, Arun Bhatia, Arjun Ghosh) with `alumniOf`, `knowsAbout`, `sameAs` (LinkedIn) |

### LLM Discoverability

- `/llms.txt`: Short context file — identity, framework, team summary, page list. Follows the emerging llms.txt standard.
- `/llms-full.txt`: Full 10-section context — Company Identity, What We Do, FlexiContext™ Framework, Products, Founding Partners, Industries/Geographies, Technology Partners, Trust & Compliance, Content, Site Map.

### Disambiguation

Flexilytics is **not** FlexAI. This is made explicit in:
- `about.html` → Why We Exist section
- `Footer.astro` — footer bottom line

### IndexNow

Key: `00d6af46d60a454eb2b84a57ed974c79`
Key file: `https://www.flexilytics.ai/00d6af46d60a454eb2b84a57ed974c79.txt`
Submission endpoint: `https://api.indexnow.org/IndexNow`
18 production URLs submitted 2026-05-22, HTTP 200 accepted.

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
│   │   ├── Footer.astro             # Site footer + "Not FlexAI" disambiguation note
│   │   ├── SEO.astro                # Typed meta / OG / Twitter / geo tags
│   │   └── JsonLd.astro             # JSON-LD script injector
│   ├── data/
│   │   ├── site.ts                  # Org constants — URL MUST be https://www.flexilytics.ai
│   │   ├── navigation.ts            # Nav link definitions
│   │   └── team.ts                  # Founder data (name, role, LinkedIn, alumni)
│   ├── lib/
│   │   ├── db.ts                    # NeonDB: insertLead, insertNewsletterSub, insertWaitlist
│   │   ├── email.ts                 # Resend: branded HTML templates for all 4 email types
│   │   ├── validation.ts            # Zod schemas: auditSchema, newsletterSchema, waitlistSchema
│   │   ├── rate-limit.ts            # In-memory IP rate limiter
│   │   └── __tests__/               # Unit tests (Vitest, 103 tests)
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
│       ├── llms.txt.ts              # GET /llms.txt — AI context (prerendered)
│       ├── llms-full.txt.ts         # GET /llms-full.txt — full AI context (prerendered)
│       ├── sitemap.xml.ts           # GET /sitemap.xml — generated from routes
│       ├── index.astro              # / (reads index.html at build time)
│       ├── about.astro              # /about
│       ├── approach.astro           # /approach
│       ├── book-audit.astro         # /book-audit
│       ├── context-engineering.astro
│       ├── insights.astro
│       ├── leadership.astro
│       ├── platforms.astro
│       ├── solutions.astro
│       ├── solutions-*.astro        # 5 solution sub-pages
│       └── trust-security.astro
├── *.html                           # Static HTML source files — primary content source
│                                    # Each .astro page reads its matching .html at build time.
│                                    # JSON-LD schemas live in the .html <head> sections.
│                                    # Do NOT delete these files.
├── public/
│   ├── favicon.ico                  # Flexilytics brand teal-F logo (multi-size ICO)
│   ├── favicon.png                  # PNG variant
│   ├── robots.txt                   # 11 AI crawlers explicitly allowed
│   ├── 00d6af46d60a454eb2b84a57ed974c79.txt  # IndexNow key file
│   └── og/                          # OG social preview images (1200×630px, one per page)
├── assets/                          # Design system assets (CSS, JS, logos, team photos)
│   ├── site.css                     # Design system v4 (CSS custom properties, all-dark palette)
│   ├── site.js                      # Nav, reveal animations, ambient canvas
│   ├── logo-full-nav.png            # Nav logo (with tagline)
│   ├── logo-footer.png              # Footer logo
│   └── team/                        # Founder portrait photos
├── astro.config.mjs                 # output: hybrid, Vercel adapter (nodeVersion: 20), site URL
├── tsconfig.json                    # Strict mode, path alias @/*
├── vercel.json                      # cleanUrls, security headers (CSP, HSTS, X-Frame-Options)
├── vitest.config.ts                 # Test config: node env, import.meta.env stubs, coverage scope
└── package.json                     # engines: node 20.x, test/coverage scripts
```

### Key Conventions

- **`site.url` is authoritative**: `src/data/site.ts` → `url` field controls ALL canonical, OG, sitemap, and schema URLs. Never hardcode `flexilytics.ai` in new files — always import `site`.
- **HTML-source pattern**: `.astro` pages read matching `.html` files and call `replaceAll('https://flexilytics.ai', site.url)`. This means schemas in `.html` files use non-www `https://flexilytics.ai` — the `.astro` normalises at build time.
- **`type="email"` inputs**: Use browser-native validation only — do NOT add `pattern` attribute (Astro strips `\s` in attribute strings).
- **API responses**: `{ ok: true }` (202) or `{ error: string }` (4xx/5xx) envelope.
- **Email sends**: `Promise.allSettled` on all sends — DB insert failure throws, email failure is logged and swallowed.
- **Deploy**: Primary = `git push origin main` (Vercel auto-deploys via git integration). Fallback = `npm run build` → `vercel deploy --prebuilt --prod` (requires `.vercel/project.json` linked to `new-corporate-website-version2`).

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev server at `http://localhost:4321` |
| `npm run build` | Production build — generates `.vercel/output/`, must pass with 0 errors |
| `npm run typecheck` | TypeScript check — 0 errors required |
| `npm run test` | Run all 103 unit tests (Vitest) |
| `npm run test:watch` | Vitest watch mode for TDD |
| `npm run test:coverage` | Generate v8 coverage report (`coverage/` dir) |
| `git push origin main` | **Primary deploy** — Vercel auto-builds and deploys to `www.flexilytics.ai` |
| `vercel deploy --prebuilt --prod` | Fallback deploy — prebuilt output, requires `.vercel/project.json` linked |

---

## Contributing

Proprietary. Internal development only.

- Never commit `.env.local` or any file containing credentials.
- Run `npm run build && npm run typecheck && npm run test` before pushing — all must be clean.
- After every deploy, verify canonical URL is `https://www.flexilytics.ai` (not `*.vercel.app`).
- Do not add `pattern` attributes to `type="email"` inputs — use browser native validation.
- All new form fields must be added to both the Zod schema (`src/lib/validation.ts`) and the API route payload.
- Schema changes: edit the `.html` source files (not `.astro` wrappers). JSON-LD lives in `<head>` of each `.html`.

---

## License

Proprietary software owned by **Flexilytics Private Limited**. All rights reserved.

Unauthorized copying, modification, distribution, or use of this software in any form is strictly prohibited. For licensing enquiries contact Ankush Shah.

---

## Acknowledgments

- **Arjun Ghosh** (Chief AI & Tech Officer) — Architecture, development, deployment, SEO/AEO engineering
- **Ankush Shah** (CEO & Founder) — Product direction, brand, content, CEO content audit (v3.0.0)
- **Flexilytics Private Limited** — Organization

---

## Git Tags and Releases

| Tag | Date | Description |
|---|---|---|
| `v3.0.1` | 2026-05-22 | **Infrastructure audit + Vercel project correction.** Identified and corrected wrong Vercel project mapping (`.vercel/project.json` was pointing to orphaned `flexilytics-corporate-v2` instead of production `new-corporate-website-version2`). Deleted 2 orphaned Vercel projects (`flexilytics-corporate-v2`, `flexilytics-corporate-website`). Diagnosed and fixed production redirect loop (`www.flexilytics.ai` ↔ `flexilytics.ai`) triggered by orphaned project deletion. Changed 307 Temporary → 308 Permanent Redirect for `flexilytics.ai → www.flexilytics.ai` (SEO link equity pass-through). Verified Namecheap DNS is correctly configured (no changes needed). Updated all agent instruction files (CLAUDE.md, AGENTS.md, CODEX.md) with verified project mapping and 5 Vercel verification rules. README corrected with accurate deploy runbook. |
| `v3.0.0` | 2026-05-22 | **New design + CEO audit + SEO/GEO remediation.** New design UI (full mobile/responsive optimisation), brand favicon, CEO-requested content updates (disambiguation, founder credential enrichment, HowTo schema), full SEO/AEO/GEO stack fix (canonical URLs from staging → www.flexilytics.ai, llms.txt/llms-full.txt, IndexNow, Person schemas, HowTo schema, robots.txt with 11 AI crawlers). 103 tests passing. |
| `v2.1.0` | 2026-05-13 | **Test suite** — 98 unit tests (Vitest). Covers Zod schemas, rate-limiter, email XSS escaping, CSP headers, form injection attacks, robots.txt AI crawler access. 100% statement/function/line coverage on all unit-testable lib files. |
| `v2.0.0` | 2026-05-13 | **Production launch** — Full Astro 4 hybrid rebuild. 18 pages, 3 API endpoints, NeonDB persistence, branded Resend HTML email, GA4, CSP security headers, generated sitemap. All 19 routes HTTP 200. |

### Commit History

| Commit | Description |
|---|---|
| `(v3.0.1)` | docs(infra): README v3.0.1 — correct Vercel project mapping, deploy runbook, Session 4 infra audit |
| `504d6b1` | docs(v3.0.0): update README to v3.0.0 milestone + tighten .gitignore |
| `305f133` | fix(build): set Astro Vercel adapter nodeVersion to 20 — prevents nodejs18.x runtime rejection on Vercel |
| `8df61f8` | feat(seo): fix canonical URLs, enrich schemas, add llms.txt — L5 audit remediation |
| `ec3c63d` | feat: add full mobile/responsive optimisation across all breakpoints |
| `971b79a` | fix: replace triangle placeholder favicon with Flexilytics brand teal-F logo |
| `0516e30` | fix: replace placeholder favicon with brand-accurate Flexilytics ICO from v1 site |
| `edb22ec` | docs: update README to v2.1.0 — add test suite section, scripts, commit history |
| `06eaf63` | fix: coverage config — exclude legacy-page.ts, schema.sql, api routes from unit coverage scope |
| `e9f185b` | feat: add unit test suite — 98 tests (validation, rate-limit, email XSS, security headers) |
| `20ec0c5` | docs: update README to v2.0.0 production state + tighten gitignore |
| `68c3f3e` | chore: flip email routing to production addresses |
| `fc04f6c` | chore: trigger redeploy to pick up new Vercel env vars |
| `0f20df8` | fix: book-audit email pattern attribute stripping — removed, native validation sufficient |
| `dbe52ce` | feat: replace bare email stubs with full branded HTML template system |
| `edb73f4` | fix: inject tweaks panel HTML into homepage foot slot |
| `a9c3b4f` | fix: add GA4/GTM domains to CSP connect-src |
| `bd815bf` | fix: add engines.node=20.x — Vercel adapter incompatible with Node 24 |
| `ca357a8` | fix: remove TWEAK_DEFAULTS from BaseLayout — eliminates duplicate const declaration |
| `12d784f` | fix: pre-deploy bug fixes — path resolution, error handling, rewrites cleanup |
| `648a4a9` | feat: all 18 pages converted to Astro, forms wired, GA4, sitemap, rate-limit, security headers |
| `ab139ae` | chore: Astro scaffold + NeonDB wiring |

---

## Open Items

| Item | Priority | Status | Notes |
|---|---|---|---|
| GSC sitemap resubmission | P0 | Pending (Ankush) | Manual: GSC UI → Sitemaps → submit `https://www.flexilytics.ai/sitemap.xml` |
| Beehiiv API key | P1 | Pending (Ankush) | Newsletter DB-only until key received. Add `BEEHIIV_API_KEY` Vercel env var. |
| Crunchbase/G2/Tracxn profiles | P1 | Pending (Ankush) | Create profiles, then add URLs to `sameAs` in `leadership.html` Organization schema |
| Content articles | P1 | Pending (Ankush) | Articles 3–10 — writing task, not engineering |
| Backlinks / guest posts | P2 | Pending (Marketing) | AnalyticsIndiaMag, ETCISO, BFSI.eletsonline, Clutch, Goodfirms |
| Founder videos | P2 | Pending (Ankush) | 4 × 90-second videos — production task |
| Service schemas on solutions pages | P2 | Engineering | Add `Service` JSON-LD to each solutions `.html` file (~30 min) |
| FAQPage schemas (BFSI, Solutions, Leadership) | P2 | Engineering | Add 3–4 Q&As per page (~3-4 hrs) |
| Replace `assets/team/arun.png` | P3 | Pending (Ankush) | Non-standardised portrait — replace with square white-bg photo |
| ✅ Vercel project mapping corrected | Done | 2026-05-22 | `.vercel/project.json` relinked to `new-corporate-website-version2` |
| ✅ Orphaned Vercel projects deleted | Done | 2026-05-22 | `flexilytics-corporate-v2` + `flexilytics-corporate-website` deleted |
| ✅ Production redirect loop fixed | Done | 2026-05-22 | `www.flexilytics.ai` ↔ `flexilytics.ai` loop resolved via manual alias |
| ✅ 307 → 308 Permanent Redirect | Done | 2026-05-22 | `flexilytics.ai → www.flexilytics.ai` now passes SEO link equity |
| ✅ Namecheap DNS verified | Done | 2026-05-22 | A `@` → `76.76.21.21`, CNAME `www` → `cname.vercel-dns.com.` — correct, no change needed |
| ✅ L5 audit P0 engineering | Done | 2026-05-22 | All P0 items complete (canonical URL, llms.txt, disambiguation, schemas, IndexNow) |

---

## Status

- **Version**: 3.0.1
- **Tag**: `v3.0.1`
- **Production URL**: `https://www.flexilytics.ai`
- **Vercel project**: `new-corporate-website-version2` (`prj_5ocS7Xo1u1OKJWHMVmnN2uzz8S16`) ✅
- **Auto-deploy**: `git push origin main` → Vercel auto-builds → `www.flexilytics.ai` updated ✅
- **Domain redirects**: `flexilytics.ai` → 308 Permanent → `www.flexilytics.ai` → 200 ✅
- **DNS**: Namecheap A `@`→`76.76.21.21`, CNAME `www`→`cname.vercel-dns.com.` (verified correct) ✅
- **Pages**: 18 static + sitemap + llms.txt + llms-full.txt, all HTTP 200
- **Forms**: All 3 API endpoints tested E2E — DB saves confirmed
- **Console errors**: 0
- **Tests**: 103/103 passing (`npm run test`) | 100% statement/function/line coverage on lib layer
- **Build**: `npm run build` ✅ | `npm run typecheck` ✅ 0 errors
- **Canonical URL**: `https://www.flexilytics.ai` on all pages ✅
- **IndexNow**: 18 URLs submitted, HTTP 200 ✅
- **Node runtime**: 20.x (Vercel + local enforced)
- **L5 audit P0**: Engineering complete — GSC resubmission + content velocity pending (Ankush)
- **License**: Proprietary — All Rights Reserved
- **Owner**: Flexilytics Private Limited

---

**Built by Arjun Ghosh (CAIO) for Flexilytics Private Limited. Product direction by Ankush Shah (CEO). © 2026.**
