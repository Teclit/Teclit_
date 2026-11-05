/**
 * Schéma Zod du formulaire de contact, PARTAGÉ entre le client Angular
 * (validateurs de formulaire) et le serveur Express (`src/server/contact.ts`).
 * `zod/mini` : API fonctionnelle tree-shakable, pour un bundle client léger.
 */
import * as z from 'zod/mini';

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 100,
  emailMax: 254,
  subjectMax: 150,
  messageMin: 20,
  messageMax: 5000,
  maxLinks: 3,
  /** Temps minimal (ms) entre l'affichage du formulaire et l'envoi : en deçà, c'est un robot. */
  minFillTimeMs: 3000,
  /** Durée maximale de validité d'un formulaire (ms). */
  maxFillTimeMs: 24 * 60 * 60 * 1000,
} as const;

const L = CONTACT_LIMITS;
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
// Caractères de contrôle (hors tabulation / retours à la ligne) — rejetés.
// eslint-disable-next-line no-control-regex
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const noControlChars = (value: string) => !CONTROL_RE.test(value);
const linkCount = (value: string) => (value.match(/https?:\/\//gi) ?? []).length;

const nameMsg = `Le nom doit contenir entre ${L.nameMin} et ${L.nameMax} caractères.`;
const messageMsg = `Le message doit contenir entre ${L.messageMin} et ${L.messageMax} caractères.`;

export const ContactFieldsSchema = z.object({
  name: z
    .string()
    .check(
      z.trim(),
      z.minLength(L.nameMin, nameMsg),
      z.maxLength(L.nameMax, nameMsg),
      z.refine(noControlChars, nameMsg),
    ),
  email: z
    .string()
    .check(
      z.trim(),
      z.toLowerCase(),
      z.minLength(1, 'Ce champ est obligatoire.'),
      z.maxLength(L.emailMax, 'Adresse email invalide.'),
      z.regex(EMAIL_RE, 'Adresse email invalide.'),
    ),
  subject: z
    .string()
    .check(
      z.trim(),
      z.maxLength(L.subjectMax, `Le sujet ne doit pas dépasser ${L.subjectMax} caractères.`),
      z.refine(noControlChars, 'Le sujet contient des caractères non autorisés.'),
    ),
  message: z.string().check(
    z.trim(),
    z.minLength(L.messageMin, messageMsg),
    z.maxLength(L.messageMax, messageMsg),
    z.refine(noControlChars, 'Le message contient des caractères non autorisés.'),
    z.refine((v) => linkCount(v) <= L.maxLinks, `Le message ne peut pas contenir plus de ${L.maxLinks} liens.`),
  ),
});

/** Payload complet envoyé par le client (champs + anti-spam). */
export const ContactPayloadSchema = z.extend(ContactFieldsSchema, {
  /** Champ piège (honeypot) : doit rester vide. */
  website: z.string(),
  /** Horodatage (ms epoch) d'affichage du formulaire. */
  startedAt: z.number(),
});

export type ContactFields = z.output<typeof ContactFieldsSchema>;
export type ContactPayload = z.input<typeof ContactPayloadSchema>;
export type ContactField = keyof ContactFields;
export type ContactErrors = Partial<Record<ContactField, string>>;

export type ContactValidationResult =
  { ok: true; data: ContactFields } | { ok: false; spam: true } | { ok: false; spam: false; errors: ContactErrors };

/** Premier message d'erreur d'une valeur pour un champ, ou null si elle est valide. */
export function contactFieldError(field: ContactField, value: unknown): string | null {
  const result = ContactFieldsSchema.shape[field].safeParse(value);
  return result.success ? null : (result.error.issues[0]?.message ?? 'Valeur invalide.');
}

/** Détection anti-spam : honeypot rempli, envoi trop rapide ou formulaire expiré. */
export function isSpam(input: unknown, now: number = Date.now()): boolean {
  const raw = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>;
  const website = typeof raw['website'] === 'string' ? raw['website'].trim() : '';
  const startedAt = typeof raw['startedAt'] === 'number' ? raw['startedAt'] : Number.NaN;
  const elapsed = now - startedAt;
  return website !== '' || !Number.isFinite(startedAt) || elapsed < L.minFillTimeMs || elapsed > L.maxFillTimeMs;
}

/** Valide et normalise un payload non fiable (utilisé côté serveur). */
export function validateContactPayload(input: unknown, now: number = Date.now()): ContactValidationResult {
  if (isSpam(input, now)) return { ok: false, spam: true };

  const result = ContactPayloadSchema.safeParse(input);
  if (result.success) {
    const { name, email, subject, message } = result.data;
    return { ok: true, data: { name, email, subject, message } };
  }
  const errors: ContactErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as ContactField | undefined;
    if (field && field in ContactFieldsSchema.shape && !errors[field]) {
      errors[field] = issue.code === 'invalid_type' ? 'Ce champ est obligatoire.' : issue.message;
    }
  }
  return { ok: false, spam: false, errors };
}
