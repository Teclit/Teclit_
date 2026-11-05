import { Router, json } from 'express';
import { rateLimit } from 'express-rate-limit';
import { Resend } from 'resend';
import { validateContactPayload, type ContactFields } from '../app/core/contact/contact.schema';

/** Envoi d'un message validé (Resend en production, faux en test). */
export type Mailer = (message: ContactFields) => Promise<void>;

export interface ContactResponse {
  status: number;
  body: Record<string, unknown>;
}

/**
 * Crée l'envoi via Resend à partir des variables d'environnement.
 * Retourne `null` si le service n'est pas configuré (l'API répond alors 503).
 *
 *   RESEND_API_KEY      clé API Resend (obligatoire)
 *   CONTACT_TO_EMAIL    destinataire des messages (obligatoire)
 *   CONTACT_FROM_EMAIL  expéditeur vérifié, ex. "Portfolio <contact@mon-domaine.fr>"
 */
export function createResendMailer(env: NodeJS.ProcessEnv = process.env): Mailer | null {
  const apiKey = env['RESEND_API_KEY'];
  const to = env['CONTACT_TO_EMAIL'];
  if (!apiKey || !to) return null;
  const resend = new Resend(apiKey);
  const from = env['CONTACT_FROM_EMAIL'] || 'Portfolio <onboarding@resend.dev>';

  return async ({ name, email, subject, message }) => {
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `[Portfolio] ${subject || `Message de ${name}`}`,
      text: `Nom : ${name}\nEmail : ${email}\nSujet : ${subject || '—'}\n\n${message}`,
    });
    if (error) throw new Error(`Resend: ${error.message}`);
  };
}

/**
 * Traitement d'une demande de contact, indépendant du framework HTTP
 * (réutilisé par le serveur Express et par la fonction Vercel `api/contact.ts`).
 */
export async function processContact(body: unknown, mailer: Mailer | null): Promise<ContactResponse> {
  const result = validateContactPayload(body);
  if (!result.ok) {
    // Spam : réponse neutre, on ne révèle pas au robot qu'il a été détecté.
    if (result.spam) return { status: 200, body: { ok: true } };
    return { status: 400, body: { error: 'Données invalides.', errors: result.errors } };
  }
  if (!mailer) return { status: 503, body: { error: "Le service d'envoi n'est pas configuré." } };
  try {
    await mailer(result.data);
    return { status: 200, body: { ok: true } };
  } catch (err) {
    console.error('[contact] échec de l’envoi', err);
    return { status: 502, body: { error: "L'envoi du message a échoué." } };
  }
}

export interface ContactRouterOptions {
  mailer: Mailer | null;
  /** Fenêtre et nombre max. de requêtes par IP (défaut : 5 requêtes / 10 min). */
  rateLimit?: { windowMs: number; limit: number };
}

/** Routeur `POST /contact` : JSON limité à 16 ko, rate limiting par IP, validation Zod partagée. */
export function createContactRouter({ mailer, rateLimit: rl }: ContactRouterOptions): Router {
  const router = Router();
  router.post(
    '/contact',
    rateLimit({
      windowMs: rl?.windowMs ?? 10 * 60 * 1000,
      limit: rl?.limit ?? 5,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: { error: 'Trop de requêtes.' },
    }),
    json({ limit: '16kb' }),
    async (req, res) => {
      const { status, body } = await processContact(req.body, mailer);
      res.status(status).set('Cache-Control', 'no-store').json(body);
    },
  );
  router.all('/contact', (_req, res) => {
    res.set('Allow', 'POST').status(405).json({ error: 'Méthode non autorisée.' });
  });
  return router;
}
