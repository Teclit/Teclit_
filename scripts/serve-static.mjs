// Mini serveur statique (sans dépendance) pour servir le build pré-rendu — utilisé par les tests e2e.
// Usage : node scripts/serve-static.mjs [port]
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGzip } from 'node:zlib';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '../dist/teclit/browser');
const port = Number(process.argv[2] ?? process.env.PORT ?? 4300);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
};

function resolveFile(urlPath) {
  const safe = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '');
  const candidates = [join(root, safe), join(root, safe, 'index.html')];
  for (const file of candidates) {
    if (file.startsWith(root) && existsSync(file) && statSync(file).isFile()) return file;
  }
  // Fallback SPA (routes non pré-rendues, ex. 404)
  const csr = join(root, 'index.csr.html');
  return existsSync(csr) ? csr : join(root, 'index.html');
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  if (url.pathname.startsWith('/api/')) {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'API indisponible en local.' }));
    return;
  }
  const file = resolveFile(url.pathname);
  const type = TYPES[extname(file)] ?? 'application/octet-stream';
  const headers = { 'Content-Type': type };
  // Cache long pour les fichiers hachés, comme en production (nginx / Vercel)
  if (/\.[A-Z0-9]{8}\.(js|css)$/.test(file)) headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  // Compression gzip des ressources texte, comme en production
  if (/text|javascript|json|xml|svg/.test(type) && /gzip/.test(req.headers['accept-encoding'] ?? '')) {
    res.writeHead(200, { ...headers, 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' });
    createReadStream(file).pipe(createGzip()).pipe(res);
    return;
  }
  res.writeHead(200, headers);
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Static server on http://localhost:${port}`));
