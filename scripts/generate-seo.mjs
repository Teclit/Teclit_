// Valide le contenu (schéma Zod) puis génère public/sitemap.xml et public/robots.txt.
// Exécuté automatiquement avant `npm run build` (script `prebuild`) : un contenu
// invalide fait échouer le build.
// Domaine : variable d'environnement SITE_URL, sinon `identity.siteUrl` du contenu.
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { ProfileWithRefsSchema } = await import('../src/app/core/content/profile.schema.ts');

const raw = JSON.parse(readFileSync(resolve(root, 'src/content/profile.json'), 'utf8'));
const parsed = ProfileWithRefsSchema.safeParse(raw);
if (!parsed.success) {
  console.error('[generate-seo] src/content/profile.json invalide :');
  for (const issue of parsed.error.issues) console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  process.exit(1);
}
const profile = parsed.data;
console.log('[generate-seo] contenu valide.');

const base = (process.env.SITE_URL || profile.identity.siteUrl).trim().replace(/\/$/, '');
const sitemapPath = resolve(root, 'public/sitemap.xml');
const robotsPath = resolve(root, 'public/robots.txt');

if (!base) {
  // Sans domaine configuré, un sitemap (URLs absolues obligatoires) serait invalide.
  rmSync(sitemapPath, { force: true });
  writeFileSync(robotsPath, 'User-agent: *\nAllow: /\nDisallow: /api/\n');
  console.warn('[generate-seo] SITE_URL / identity.siteUrl vides : robots.txt généré sans sitemap.');
  process.exit(0);
}

const today = new Date().toISOString().slice(0, 10);
const paths = ['/', '/cv', ...profile.projects.map((p) => `/projets/${p.slug}`)];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (path) => `  <url>
    <loc>${base}${path}</loc>
    <lastmod>${today}</lastmod>
    <priority>${path === '/' ? '1.0' : '0.7'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${base}/sitemap.xml
`;

writeFileSync(sitemapPath, sitemap);
writeFileSync(robotsPath, robots);
console.log(`[generate-seo] sitemap.xml (${paths.length} URLs) et robots.txt générés.`);
