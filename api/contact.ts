/**
 * Fonction serverless (Vercel) — POST /api/contact
 *
 * - Validation serveur partagée avec le client (`validateContactPayload`).
 * - Anti-spam : honeypot, délai minimal de remplissage, limite de liens, rate limiting par IP.
 * - Envoi via l'API Resend (https://resend.com) si `RESEND_API_KEY` est défini.
 *
 * Variables d'environnement :
 *   RESEND_API_KEY      (obligatoire)  clé API Resend
 *   CONTACT_TO_EMAIL    (obligatoire)  destinataire des messages
 *   CONTACT_FROM_EMAIL  (optionnel)    expéditeur vérifié, ex. "Portfolio <contact@mon-domaine.fr>"
 */
import { validateContactPayload } from '../src/app/core/contact/contact-validation';

interface ApiRequest {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}

interface ApiResponse {
  status(code: number): ApiResponse;
  setHeader(name: string, value: string): void;
  json(body: unknown): void;
}

const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 };
const hits = new Map<string, number[]>();

/** Rate limiting en mémoire (best effort : réinitialisé à chaque démarrage à froid). */
export function isRateLimited(ip: string, now: number = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT.max;
}

function clientIp(req: ApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return value?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
}

function parseBody(body: unknown): unknown {
  if (typeof body !== 'string') return body;
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Méthode non autorisée.' });
    return;
  }

  if (isRateLimited(clientIp(req))) {
    res.status(429).json({ error: 'Trop de requêtes.' });
    return;
  }

  const result = validateContactPayload(parseBody(req.body));
  if (!result.ok) {
    if (result.spam) {
      // Réponse neutre : on ne révèle pas au robot qu'il a été détecté.
      res.status(200).json({ ok: true });
      return;
    }
    res.status(400).json({ error: 'Données invalides.', errors: result.errors });
    return;
  }

  const apiKey = process.env['RESEND_API_KEY'];
  const to = process.env['CONTACT_TO_EMAIL'];
  if (!apiKey || !to) {
    res.status(503).json({ error: "Le service d'envoi n'est pas configuré." });
    return;
  }

  const { name, email, subject, message } = result.data;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env['CONTACT_FROM_EMAIL'] ?? 'Portfolio <onboarding@resend.dev>',
      to: [to],
      reply_to: email,
      subject: `[Portfolio] ${subject || `Message de ${name}`}`,
      text: `Nom : ${name}\nEmail : ${email}\nSujet : ${subject || '—'}\n\n${message}`,
    }),
  });

  if (!response.ok) {
    res.status(502).json({ error: "L'envoi du message a échoué." });
    return;
  }
  res.status(200).json({ ok: true });
}
