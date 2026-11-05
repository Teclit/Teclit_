// Génère public/sitemap.xml et public/robots.txt depuis la source de données unique.
// Exécuté automatiquement avant `npm run build` (script `prebuild`).
// Nécessite Node >= 22.12 (import direct d'un fichier .ts via --experimental-strip-types, cf. package.json).
import { rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { PROFILE } = await import('../src/app/data/profile.data.ts');

const base = PROFILE.identity.siteUrl.trim().replace(/\/$/, '');
const sitemapPath = resolve(root, 'public/sitemap.xml');
const robotsPath = resolve(root, 'public/robots.txt');

if (!base) {
  // Sans domaine configuré, un sitemap (URLs absolues obligatoires) serait invalide : on ne le génère pas.
  rmSync(sitemapPath, { force: true });
  writeFileSync(robotsPath, 'User-agent: *\nAllow: /\nDisallow: /api/\n');
  console.warn('[generate-seo] identity.siteUrl vide : robots.txt généré sans sitemap.');
  process.exit(0);
}

const today = new Date().toISOString().slice(0, 10);
const paths = ['/', '/cv', ...PROFILE.projects.map((p) => `/projets/${p.slug}`)];

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
