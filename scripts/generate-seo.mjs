// Génère public/sitemap.xml et public/robots.txt depuis la source de données unique.
// Exécuté automatiquement avant `npm run build` (script `prebuild`).
// Nécessite Node >= 22.12 (import direct d'un fichier .ts via --experimental-strip-types, cf. package.json).
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { PROFILE } = await import('../src/app/data/profile.data.ts');

const configured = PROFILE.identity.siteUrl;
const isTodo = configured.trim().startsWith('TODO:');
const base = (isTodo ? 'https://TODO-votre-domaine.fr' : configured).replace(/\/$/, '');
if (isTodo) {
  console.warn('[generate-seo] identity.siteUrl est un TODO : sitemap/robots générés avec un domaine placeholder.');
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

writeFileSync(resolve(root, 'public/sitemap.xml'), sitemap);
writeFileSync(resolve(root, 'public/robots.txt'), robots);
console.log(`[generate-seo] sitemap.xml (${paths.length} URLs) et robots.txt générés.`);
