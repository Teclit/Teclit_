/**
 * Validation du formulaire de contact, partagée entre le client (Angular)
 * et la fonction serveur (`api/contact.ts`). Aucune dépendance Angular ici.
 */

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 100,
  emailMax: 254,
  subjectMax: 150,
  messageMin: 20,
  messageMax: 5000,
  /** Temps minimal (ms) entre l'affichage du formulaire et l'envoi : en deçà, c'est un robot. */
  minFillTimeMs: 3000,
  /** Durée maximale de validité d'un formulaire (ms). */
  maxFillTimeMs: 24 * 60 * 60 * 1000,
} as const;

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Champ piège (honeypot) : doit rester vide. */
  website: string;
  /** Horodatage (ms epoch) d'affichage du formulaire. */
  startedAt: number;
}

export type ContactField = 'name' | 'email' | 'subject' | 'message';

export type ContactValidationResult =
  | { ok: true; data: Pick<ContactPayload, ContactField> }
  | { ok: false; spam: true }
  | { ok: false; spam: false; errors: Partial<Record<ContactField, string>> };

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
// Caractères de contrôle (hors tabulation / retours à la ligne) — rejetés.
// eslint-disable-next-line no-control-regex
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const LINK_RE = /https?:\/\//gi;
const MAX_LINKS = 3;

export function isValidEmail(value: string): boolean {
  return value.length <= CONTACT_LIMITS.emailMax && EMAIL_RE.test(value);
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** Valide et normalise un payload de contact non fiable. */
export function validateContactPayload(input: unknown, now: number = Date.now()): ContactValidationResult {
  const raw = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>;

  // --- Anti-spam ---------------------------------------------------------------
  const website = asString(raw['website']);
  const startedAt = typeof raw['startedAt'] === 'number' ? raw['startedAt'] : Number.NaN;
  const elapsed = now - startedAt;
  if (
    website !== '' ||
    !Number.isFinite(startedAt) ||
    elapsed < CONTACT_LIMITS.minFillTimeMs ||
    elapsed > CONTACT_LIMITS.maxFillTimeMs
  ) {
    return { ok: false, spam: true };
  }

  // --- Champs -------------------------------------------------------------------
  const name = asString(raw['name']);
  const email = asString(raw['email']).toLowerCase();
  const subject = asString(raw['subject']);
  const message = asString(raw['message']);
  const errors: Partial<Record<ContactField, string>> = {};

  if (name.length < CONTACT_LIMITS.nameMin || name.length > CONTACT_LIMITS.nameMax || CONTROL_RE.test(name)) {
    errors.name = `Le nom doit contenir entre ${CONTACT_LIMITS.nameMin} et ${CONTACT_LIMITS.nameMax} caractères.`;
  }
  if (!isValidEmail(email)) {
    errors.email = 'Adresse email invalide.';
  }
  if (subject.length > CONTACT_LIMITS.subjectMax || CONTROL_RE.test(subject)) {
    errors.subject = `Le sujet ne doit pas dépasser ${CONTACT_LIMITS.subjectMax} caractères.`;
  }
  if (message.length < CONTACT_LIMITS.messageMin || message.length > CONTACT_LIMITS.messageMax) {
    errors.message = `Le message doit contenir entre ${CONTACT_LIMITS.messageMin} et ${CONTACT_LIMITS.messageMax} caractères.`;
  } else if (CONTROL_RE.test(message)) {
    errors.message = 'Le message contient des caractères non autorisés.';
  } else if ((message.match(LINK_RE) ?? []).length > MAX_LINKS) {
    errors.message = `Le message ne peut pas contenir plus de ${MAX_LINKS} liens.`;
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, spam: false, errors };
  }
  return { ok: true, data: { name, email, subject, message } };
}
