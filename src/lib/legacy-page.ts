import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { site } from '@/data/site';

const LEGACY_BASE_DIR = join(process.cwd(), 'new-designdocs-part-2', 'deploy');
const LEGACY_ROUTE_MAP: Array<[string, string]> = [
  ['index.html', '/'],
  ['about.html', '/about'],
  ['approach.html', '/approach'],
  ['book-audit.html', '/book-audit'],
  ['bfsi.html', '/industries/bfsi'],
  ['context-engineering.html', '/context-engineering'],
  ['insights.html', '/insights'],
  ['insights-context-engineering-buyable-category.html', '/insights/context-engineering-buyable-category'],
  ['insights-fabric-vs-databricks-bfsi.html', '/insights/fabric-vs-databricks-bfsi'],
  ['leadership.html', '/leadership'],
  ['platforms.html', '/platforms'],
  ['solutions.html', '/solutions'],
  ['solutions-ai-ml-engineering.html', '/solutions-ai-ml-engineering'],
  ['solutions-analytics-bi.html', '/solutions-analytics-bi'],
  ['solutions-data-governance.html', '/solutions-data-governance'],
  ['solutions-flexianalyst.html', '/solutions-flexianalyst'],
  ['solutions-modern-data-platform.html', '/solutions-modern-data-platform'],
  ['trust-security.html', '/trust-security'],
];

export interface LegacyPageData {
  title: string;
  description: string;
  inlineStyles: string;
  schemas: Record<string, unknown>[];
  mainHtml: string;
  rawHtml: string;
}

function normalizeLegacyHtml(html: string) {
  let normalized = html.replaceAll('https://flexilytics.ai', site.url);

  normalized = normalized.replaceAll('href="assets/', 'href="/assets/');
  normalized = normalized.replaceAll("href='assets/", "href='/assets/");
  normalized = normalized.replaceAll('src="assets/', 'src="/assets/');
  normalized = normalized.replaceAll("src='assets/", "src='/assets/");

  for (const [legacy, modern] of LEGACY_ROUTE_MAP) {
    normalized = normalized.replaceAll(`href="${legacy}"`, `href="${modern}"`);
    normalized = normalized.replaceAll(`href='${legacy}'`, `href='${modern}'`);
  }

  return normalized;
}

export async function loadLegacyPage(fileName: string): Promise<LegacyPageData> {
  const legacyPath = join(LEGACY_BASE_DIR, fileName);
  const fallbackPath = join(process.cwd(), fileName);
  const rawHtml = await readFile(legacyPath, 'utf8').catch(async () => readFile(fallbackPath, 'utf8'));
  const normalized = normalizeLegacyHtml(rawHtml);

  const title = normalized.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? site.name;
  const description =
    normalized.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1]?.trim() ??
    site.description;
  const inlineStyles = Array.from(
    normalized.matchAll(/<style>([\s\S]*?)<\/style>/gi),
    (match) => match[1].trim(),
  ).join('\n');
  const schemas = Array.from(
    normalized.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/gi),
    (match) => JSON.parse(match[1]),
  );
  const mainHtml = normalized.match(/<main>([\s\S]*?)<\/main>/i)?.[1]?.trim() ?? '';

  return { title, description, inlineStyles, schemas, mainHtml, rawHtml };
}

export function renderLegacyMainHtml(html: string) {
  return html;
}
