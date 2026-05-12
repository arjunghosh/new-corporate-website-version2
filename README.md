# Flexilytics Corporate Website v2

Static HTML corporate website for **Flexilytics Private Limited** — The Context Engineering firm for enterprise AI.

**Live:** https://flexilytics-corporate-v2.vercel.app  
**Repo:** https://github.com/arjunghosh/new-corporate-website-version2

---

## Overview

18-page static HTML site. No build step — pure HTML, CSS, and JavaScript. Drop-in deployment behind any static host.

**Tagline:** Intelligence. Grounded.  
**Positioning:** The Context Engineering firm for regulated enterprise AI (BFSI focus — RBI / SEBI / IRDAI / DPDP Act)

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
├── index.html                    # Homepage (self-contained inline CSS)
├── *.html                        # All other pages (link assets/site.css)
├── assets/
│   ├── site.css                  # Shared design system v4
│   ├── site.js                   # Nav, reveal animations, ambient canvas
│   ├── logo-on-dark.png          # Nav logo
│   ├── logo-wide.png             # Footer logo
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
└── vercel.json                   # cleanUrls, /industries/bfsi rewrite
```

---

## Architecture Notes

- **`index.html` inlines its own CSS** — does not link `assets/site.css`. Equivalent tokens maintained inline.
- All secondary pages link `assets/site.css` then add a page-specific `<style>` block.
- **Nav and footer markup is identical across all 18 pages** — edit one, propagate by find-and-replace.
- `/industries/bfsi` is served via a `vercel.json` rewrite pointing to `bfsi.html` at root. A companion rewrite proxies `/industries/assets/*` → `/assets/*` so relative asset paths resolve correctly.
- All forms use `mailto:` placeholders — needs a form backend before launch.
- The Tweaks panel (`#tweaks`, motion / ambient toggles) is intentionally left in for production.

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
- [ ] Wire form submissions in `book-audit.html` (currently `mailto:` placeholder)
- [ ] Verify `Organization.address` and geo coordinates in JSON-LD
- [ ] Submit `sitemap.xml` to Google Search Console + Bing Webmaster Tools after domain go-live

---

## Browser Support

Targets evergreen Chromium, Safari ≥ 16, Firefox ≥ 110. Uses CSS Grid, `backdrop-filter`, and `text-wrap: balance/pretty`.
