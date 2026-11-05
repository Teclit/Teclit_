import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export interface InlineHashes {
  /** Hashes des scripts inline exécutables (thème, event replay…). */
  scripts: string[];
  /** Hashes des gestionnaires d'événements inline (ex. `onload` du CSS critique). */
  handlers: string[];
}

const sha256 = (value: string) => `'sha256-${createHash('sha256').update(value, 'utf8').digest('base64')}'`;

/** Extrait les hashes CSP des scripts / handlers inline d'un document HTML. */
export function hashInlineCode(html: string): InlineHashes {
  const scripts = new Set<string>();
  const handlers = new Set<string>();
  for (const [, attrs = '', body = ''] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc\s*=/i.test(attrs) || /type\s*=\s*["']?application\/(ld\+)?json/i.test(attrs) || !body) continue;
    scripts.add(sha256(body));
  }
  for (const [, , value = ''] of html.matchAll(/\son[a-z]+\s*=\s*(["'])(.*?)\1/gi)) {
    handlers.add(sha256(value));
  }
  return { scripts: [...scripts], handlers: [...handlers] };
}

/**
 * Parcourt les pages HTML du build (pré-rendues + gabarit SSR) et agrège les
 * hashes : la CSP n'autorise que le code inline réellement produit par le build.
 */
export function collectInlineHashes(dir: string): InlineHashes {
  const scripts = new Set<string>();
  const handlers = new Set<string>();
  const walk = (current: string) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.name.endsWith('.html')) {
        const hashes = hashInlineCode(readFileSync(path, 'utf8'));
        hashes.scripts.forEach((h) => scripts.add(h));
        hashes.handlers.forEach((h) => handlers.add(h));
      }
    }
  };
  walk(dir);
  return { scripts: [...scripts], handlers: [...handlers] };
}
