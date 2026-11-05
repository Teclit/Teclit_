import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import { join } from 'node:path';
import { createApp } from './server/app';
import { createResendMailer } from './server/contact';
import { collectInlineHashes, type InlineHashes } from './server/csp';

const browserDistFolder = join(import.meta.dirname, '../browser');

/**
 * Hôtes autorisés pour le rendu (protection SSRF d'Angular SSR) :
 * localhost + `NG_ALLOWED_HOSTS` (liste séparée par des virgules) + hôte de `SITE_URL`.
 */
const allowedHosts = [
  'localhost',
  '127.0.0.1',
  ...(process.env['NG_ALLOWED_HOSTS'] ?? '').split(',').map((h) => h.trim()),
  process.env['SITE_URL'] ? new URL(process.env['SITE_URL']).hostname : '',
].filter(Boolean);
const angularApp = new AngularNodeAppEngine({ allowedHosts });

const mailer = createResendMailer();
if (!mailer) console.warn('[contact] RESEND_API_KEY / CONTACT_TO_EMAIL absents : /api/contact répondra 503.');

/** Hashes CSP du code inline du build (absent en dev-server : CSP sans scripts inline). */
let inlineHashes: InlineHashes | undefined;
try {
  inlineHashes = collectInlineHashes(browserDistFolder);
} catch {
  inlineHashes = undefined;
}

const app = createApp({
  inlineHashes,
  browserDistFolder,
  trustProxy: Number(process.env['TRUST_PROXY'] ?? 0),
  contact: {
    mailer,
    rateLimit: { windowMs: 10 * 60 * 1000, limit: Number(process.env['CONTACT_RATE_LIMIT'] ?? 5) },
  },
  renderer: (req, res, next) => {
    angularApp
      .handle(req)
      .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
      .catch(next);
  },
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = Number(process.env['PORT'] ?? 4000);
  app.listen(port, (error) => {
    if (error) throw error;
    console.log(`Serveur SSR à l'écoute sur http://localhost:${port}`);
  });
}

/** Handler utilisé par l'Angular CLI (dev-server et build). */
export const reqHandler = createNodeRequestHandler(app);
