# Flexilytics — Static Site Bundle

Pre-launch static site, ready for any static host (S3 + CloudFront, Vercel, Netlify, GitHub Pages, NGINX).

## Structure

```
deploy/
├── index.html                                          ← homepage (self-contained)
├── approach.html                                       ← Approach hub
├── context-engineering.html                            ← FlexiContext deep-dive
├── solutions.html                                      ← Solutions hub
├── solutions-data-governance.html
├── solutions-modern-data-platform.html
├── solutions-ai-ml-engineering.html
├── solutions-analytics-bi.html
├── solutions-flexianalyst.html                         ← waitlist + preview
├── platforms.html                                      ← flagships + ecosystem
├── trust-security.html                                 ← four pillars
├── insights.html                                       ← insights hub
├── insights-context-engineering-buyable-category.html
├── insights-fabric-vs-databricks-bfsi.html
├── about.html                                          ← company + Foundation teaser
├── leadership.html                                     ← four leaders
├── bfsi.html                                           ← industry page
├── book-audit.html                                     ← lead-gen form (validation included)
├── robots.txt                                          ← AI crawlers explicitly allowed
├── sitemap.xml                                         ← 18 URLs, weighted priorities
└── assets/
    ├── site.css                                        ← shared design system (nav, footer, type, components)
    ├── site.js                                         ← shared scripts (nav scroll, reveals, ambient canvas, tweaks)
    ├── logo-mark.png  · logo-wide.png  · logo-stacked.png
    ├── logo-black.png · logo-white.png · logo-light.png · logo-transparent.png
    ├── flexilytics-logo.png
    └── team/
        ├── ankush.jpeg
        ├── arun.png        ← non-standardized; replace before launch
        └── vishal.jpeg
```

## Architecture notes

- **`assets/site.css`** is the shared design system. Every secondary page links it. The homepage (`index.html`) embeds its own equivalent inline (custom hero rendering); shared types/colors are identical.
- **`assets/site.js`** wires the nav scroll-state, the on-scroll reveal animations, the ambient particle canvas, and the Tweaks panel.
- Each page also has a small page-specific `<style>` block inline — only the styles unique to that page.

## Conventions

- Nav and footer markup is identical across all 18 pages. Edit once, propagate by find-and-replace.
- The Tweaks panel (motion / ambient toggles) is end-user-facing — leave it in for production.
- All forms post to `mailto:` placeholders. Wire up your form backend (e.g. Formspree, Netlify Forms, custom API) before launch — see `book-audit.html`'s `<script>` block at the bottom.

## SEO / AEO / GEO

Every page ships with a single auto-generated block (delimited `<!-- SEO-AEO-GEO BEGIN/END -->`) containing:

- Canonical URL, robots directive (`max-image-preview:large`), author, locale (`en_IN`)
- Open Graph (type, url, title, desc, image 1200×630, locale, site_name)
- Twitter `summary_large_image` card
- Article-typed pages additionally emit `article:published_time`, `modified_time`, `author`, `section`, `tag`
- `geo.region` / `geo.placename` / `ICBM` (Mumbai)
- **JSON-LD graph**: `Organization` + `WebSite` (sitewide) + page-typed node (`WebPage` / `AboutPage` / `CollectionPage` / `Blog` / `Article` / `Service` / `Product`) + `BreadcrumbList`. Pages with question intent (home, approach, context-engineering, book-audit) also emit `FAQPage` schema. Sub-solution pages emit `Service`. Insight articles emit full `Article` + `Person` author.

`robots.txt` explicitly **allows** GPTBot, ClaudeBot, anthropic-ai, Google-Extended, PerplexityBot, Applebot-Extended, CCBot, Bytespider, meta-externalagent — many sites silently block these and lose ChatGPT/Claude/Perplexity citations.

The injection block is idempotent: re-running the injector replaces it cleanly. Don't hand-edit inside the markers.

## Open items (to do before launch)

1. Replace Arun's photo (`assets/team/arun.png`) with a square, white-background portrait matching ankush.jpeg / vishal.jpeg.
2. Wire form submissions in `book-audit.html` (and any future capture forms).
3. **Add real `og:image` files at `/og/{page}.png`** — referenced from every page's OG/Twitter meta. Until these exist, social shares will show broken previews. Either generate the 1200×630 cards or strip the `og:image` lines.
4. Foundation page is a teaser only on `about.html` — full content lives at `flexilytics.foundation` (separate site, future).
5. LinkedIn URLs on `leadership.html` are `#` placeholders. Confirm the company LinkedIn handle in `Organization.sameAs` JSON-LD too.
6. Verify the `Organization.address` and `geo` coords match the registered office before launch.
7. After deploy, submit `sitemap.xml` to Google Search Console and Bing Webmaster Tools.

## Browser support

Targets evergreen Chromium, Safari ≥ 16, Firefox ≥ 110. Uses CSS Grid, `backdrop-filter`, and `text-wrap: balance/pretty`.

## Build

No build step. Drop the folder behind a static host. That's it.
