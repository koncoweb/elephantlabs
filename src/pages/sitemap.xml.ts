const SITE = 'https://elephantlabs.web.id';
const LASTMOD = '2026-09-10';

const routes: { path: string; priority: string; changefreq: string }[] = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/text-to-speech', priority: '0.9', changefreq: 'weekly' },
  { path: '/login', priority: '0.4', changefreq: 'yearly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.5', changefreq: 'yearly' },
  { path: '/security', priority: '0.5', changefreq: 'yearly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' }
];

export const prerender = true;

export async function GET(): Promise<Response> {
  const urls = routes
    .map(
      (r) => `  <url>
    <loc>${SITE}${r.path}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
}
