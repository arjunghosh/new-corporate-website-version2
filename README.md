# Flexilytics Corporate Website v2

Astro 4 corporate website for **Flexilytics Private Limited** - The Context Engineering firm for enterprise AI.

**Live:** https://flexilytics-corporate-v2.vercel.app  
**Repo:** https://github.com/arjunghosh/new-corporate-website-version2

---

## Overview

18-page corporate site migrated from static HTML to Astro. Shared layout, data, API routes, sitemap generation, GA4, and Vercel hardening are in place. The original source bundle used for parity checks lives at `new-designdocs-part-2/deploy/`.

**Tagline:** Intelligence. Grounded.  
**Positioning:** The Context Engineering firm for regulated enterprise AI (BFSI focus — RBI / SEBI / IRDAI / DPDP Act)

---

## Codex Work

- Correct comparison baseline: `new-designdocs-part-2/deploy/`
- Astro pages converted: all 18 public HTML pages
- Shared shell updated: `BaseLayout`, `SEO`, `JsonLd`, nav/footer, GA4
- Backend routes live: `/api/audit`, `/api/newsletter`, `/api/waitlist`
- Sitemap is generated from `src/pages/sitemap.xml.ts`
- CSP and security headers are set in `vercel.json`
- Remaining work is final browser parity verification on the deployed URL plus any pixel-level drift fixes

---

## Pages

| Page | Clean URL | File |
|---|---|---|
| Homepage | `/` | `index.html` |
| Approach | `/approach` | `approach.html` |
| Context Engineering | `/context-engineering` | `context-engineering.html` |
| Solutions Hub | `/solutions` | `solutions.html` |
| Data Governance | `/solutions-data-governance` | `solutions-data-governance.html` |
| Modern Data Platform | `/solutions-modern-data-platform` | `solutions-modern-data-platform.html` |
| AI/ML Engineering | `/solutions-ai-ml-engineering` | `solutions-ai-ml-engineering.html` |
| Analytics & BI | `/solutions-analytics-bi` | `solutions-analytics-bi.html` |
| FlexiAnalyst | `/solutions-flexianalyst` | `solutions-flexianalyst.html` |
| Platforms | `/platforms` | `platforms.html` |
| Trust & Security | `/trust-security` | `trust-security.html` |
| Insights Hub | `/insights` | `insights.html` |
| Article — Context Engineering | `/insights-context-engineering-buyable-category` | `insights-context-engineering-buyable-category.html` |
| Article — Fabric vs Databricks | `/insights-fabric-vs-databricks-bfsi` | `insights-fabric-vs-databricks-bfsi.html` |
| About | `/about` | `about.html` |
| Leadership | `/leadership` | `leadership.html` |
| BFSI Industry | `/industries/bfsi` | `bfsi.html` |
| Book Audit | `/book-audit` | `book-audit.html` |

---

## Project Structure

```
├── new-designdocs-part-2/deploy/  # Original static HTML bundle used for parity reference
├── index.html                    # Legacy homepage source HTML preserved at repo root
├── *.html                        # Legacy source pages preserved at repo root
├── assets/
│   ├── site.css                  # Shared design system v4
│   ├── site.js                   # Nav, reveal animations, ambient canvas
│   ├── logo-full-nav.png         # Nav header logo (1941×409px RGBA, tight crop, transparent bg, incl. tagline)
│   ├── logo-footer.png           # Footer logo (1941×409px RGBA, tight crop, transparent bg, grey-toned)
│   ├── logo-on-dark.png          # Source only — black bg, do NOT use directly (pixelation)
│   ├── logo-wide.png             # Source only — transparent bg, do NOT use directly (same issue)
│   ├── logo-nav.png              # Deprecated — replaced by logo-full-nav.png
│   └── team/
│       ├── ankush.jpeg
│       ├── vishal.jpeg
│       ├── arun.png              # Replace before launch (non-standardised portrait)
│       └── arjun.jpeg            # 800px / 45KB optimised JPEG
├── og/                           # Social share images (1200×630px)
│   └── *.png                     # One per page, matches og:image meta tags
├── favicon.ico                   # Multi-size ICO (16 / 32 / 48px)
├── robots.txt                    # AI crawlers explicitly allowed
├── sitemap.xml                   # 18 URLs, weighted priorities
├── src/
│   ├── components/               # Shared Astro components
│   ├── data/                     # Typed site content
│   ├── layouts/                  # Shared BaseLayout
│   ├── lib/                      # DB, email, validation, rate-limit helpers
│   └── pages/api/                # POST /api/audit, /api/newsletter, /api/waitlist
└── vercel.json                   # cleanUrls, /industries/bfsi rewrite, security headers
```

---

## Architecture Notes

- `src/layouts/BaseLayout.astro` is the shared shell for converted pages.
- `src/components/Nav.astro` and `src/components/Footer.astro` centralize repeated markup.
- `src/components/SEO.astro` and `src/components/JsonLd.astro` handle metadata and schema injection.
- `src/pages/api/audit.ts`, `newsletter.ts`, and `waitlist.ts` are live server routes.
- `index.html` still inlines its own CSS until the homepage is converted to Astro.
- Secondary pages still source their content from HTML and will be ported page by page.
- `/industries/bfsi` is served via a `vercel.json` rewrite until an Astro page replaces the HTML source.

---

## SEO / AEO / GEO

Every page ships with an auto-generated block delimited by `<!-- SEO-AEO-GEO BEGIN/END -->` containing:

- Canonical URL, robots directive, author, locale (`en_IN`)
- Open Graph (type, url, title, description, image 1200×630, locale, site_name)
- Twitter `summary_large_image` card
- `geo.region` / `geo.placename` / `ICBM` (Mumbai)
- JSON-LD graph: `Organization` + `WebSite` + page-typed node + `BreadcrumbList`
- `FAQPage` schema on: home, approach, context-engineering, book-audit
- `Article` + `Person` author schema on insight articles

`robots.txt` explicitly allows GPTBot, ClaudeBot, anthropic-ai, Google-Extended, PerplexityBot, Applebot-Extended, CCBot, Bytespider, meta-externalagent.

---

## Current Status

### Done
- Astro scaffold committed locally
- Shared layout, nav, footer, SEO, and JSON-LD components created
- API routes for audit, newsletter, and waitlist created
- NeonDB wiring, validation, and rate limiting implemented
- Sitemap route generated from Astro
- GA4 injected in shared layout
- CSP and baseline security headers added
- Build and type-check currently pass

### Pending
- Final visual parity review against `https://new-corporate-website-version2.vercel.app/`
- Pixel-level drift fixes if any page deviates from the legacy baseline
- Publish only after the parity pass is clean

---

## Deployment

```bash
# Deploy to Vercel production
vercel --prod

# Preview deployment
vercel
```

Pushes to `main` auto-deploy via GitHub integration.

---

## Founding Team

| Name | Role | LinkedIn |
|---|---|---|
| Ankush Shah | CEO & Founder | [/in/ankushshah](https://www.linkedin.com/in/ankushshah/) |
| Vishal Dhure | COO & CRO | [/in/vishaldhure](https://www.linkedin.com/in/vishaldhure/) |
| Arun Bhatia | Chief Tech Program Manager | [/in/bhatiaarun](https://www.linkedin.com/in/bhatiaarun/) |
| Arjun Ghosh | Chief AI & Tech Officer | [/in/arjunghosh](https://www.linkedin.com/in/arjunghosh/) |

---

## Pre-Launch Open Items

- [ ] Replace `assets/team/arun.png` with square white-background portrait
- [ ] Verify `Organization.address` and geo coordinates in JSON-LD
- [ ] Submit the generated sitemap to Google Search Console + Bing Webmaster Tools after domain go-live

---

## Browser Support

Targets evergreen Chromium, Safari ≥ 16, Firefox ≥ 110. Uses CSS Grid, `backdrop-filter`, and `text-wrap: balance/pretty`.
