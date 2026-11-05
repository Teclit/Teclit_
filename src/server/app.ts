import compression from 'compression';
import express, { type ErrorRequestHandler, type Express, type RequestHandler } from 'express';
import helmet from 'helmet';
import { createContactRouter, type ContactRouterOptions } from './contact';
import type { InlineHashes } from './csp';

export interface AppOptions {
  /** Dossier `dist/<app>/browser` (fichiers statiques). Absent en test. */
  browserDistFolder?: string;
  /** Rendu Angular (SSR / pages pré-rendues), branché en dernier. */
  renderer?: RequestHandler;
  contact: ContactRouterOptions;
  /** Nombre de proxys de confiance devant le serveur (IP client pour le rate limiting). */
  trustProxy?: number;
  /** Hashes du code inline autorisé par la CSP (cf. collectInlineHashes). */
  inlineHashes?: InlineHashes;
}

/**
 * En-têtes de sécurité (helmet). CSP stricte pour les scripts : 'self' + hashes
 * des scripts inline générés par le build, sans 'unsafe-inline'.
 */
export function securityHeaders({ scripts = [], handlers = [] }: Partial<InlineHashes> = {}): RequestHandler {
  return helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", ...scripts, ...(handlers.length ? ["'unsafe-hashes'", ...handlers] : [])],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:'],
        'font-src': ["'self'"],
        'connect-src': ["'self'"],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
      },
    },
    strictTransportSecurity: { maxAge: 63072000, includeSubDomains: true, preload: true },
    xFrameOptions: { action: 'deny' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    crossOriginEmbedderPolicy: false,
  });
}

/** Fichiers JS/CSS hachés par le build (`main-3CYKIWCD.js`, `chunk-Bac7o1IF.js`). */
const HASHED_ASSET = /-[A-Za-z0-9_]{8}\.(js|css)$/;

export function createApp({ browserDistFolder, renderer, contact, trustProxy, inlineHashes }: AppOptions): Express {
  const app = express();
  app.disable('x-powered-by');
  if (trustProxy) app.set('trust proxy', trustProxy);

  app.use(compression());
  app.use(securityHeaders(inlineHashes));
  app.use((_req, res, next) => {
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });

  app.get('/healthz', (_req, res) => {
    res.set('Cache-Control', 'no-store').json({ status: 'ok' });
  });

  app.use('/api', createContactRouter(contact));
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Ressource introuvable.' });
  });

  if (browserDistFolder) {
    app.use(
      express.static(browserDistFolder, {
        index: false,
        redirect: false,
        setHeaders: (res, path) => {
          // Fichiers hachés par le build : immuables. Autres (images, favicon…) : 1 semaine.
          res.setHeader(
            'Cache-Control',
            HASHED_ASSET.test(path.replace(/\\/g, '/'))
              ? 'public, max-age=31536000, immutable'
              : 'public, max-age=604800',
          );
        },
      }),
    );
  }

  if (renderer) app.use(renderer);

  const onError: ErrorRequestHandler = (err, _req, res, next) => {
    if (res.headersSent) return next(err);
    const status = typeof err?.status === 'number' ? err.status : 500;
    if (status >= 500) console.error(err);
    res.status(status).json({ error: status === 413 ? 'Requête trop volumineuse.' : 'Erreur serveur.' });
  };
  app.use(onError);

  return app;
}
