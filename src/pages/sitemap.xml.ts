import type { APIRoute } from 'astro';
import { site } from '@/data/site';

const lastmod = new Date().toISOString().slice(0, 10);

const routes = [
  ['/', 'weekly', '1.0'],
  ['/approach', 'monthly', '0.9'],
  ['/context-engineering', 'monthly', '0.9'],
  ['/solutions', 'monthly', '0.9'],
  ['/solutions-data-governance', 'monthly', '0.8'],
  ['/solutions-modern-data-platform', 'monthly', '0.8'],
  ['/solutions-ai-ml-engineering', 'monthly', '0.8'],
  ['/solutions-analytics-bi', 'monthly', '0.8'],
  ['/solutions-flexianalyst', 'monthly', '0.7'],
  ['/platforms', 'monthly', '0.8'],
  ['/industries/bfsi', 'monthly', '0.8'],
  ['/insights', 'weekly', '0.8'],
  ['/insights/context-engineering-buyable-category', 'monthly', '0.7'],
  ['/insights/fabric-vs-databricks-bfsi', 'monthly', '0.7'],
  ['/about', 'monthly', '0.7'],
  ['/leadership', 'monthly', '0.7'],
  ['/trust-security', 'monthly', '0.7'],
  ['/book-audit', 'monthly', '0.9'],
] as const;

export const prerender = true;

export const GET: APIRoute = () => {
  const urls = routes
    .map(
      ([path, changefreq, priority]) => `  <url>
    <loc>${site.url}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
    )
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    },
  );
};
