import { CONTACT_LIMITS, contactFieldError, validateContactPayload } from './contact.schema';

describe('validateContactPayload', () => {
  const now = 1700000000000;
  const valid = {
    name: 'Ada Lovelace',
    email: 'Ada@Example.com',
    subject: 'Mission backend',
    message: 'Bonjour, je souhaiterais échanger sur une mission Java.',
    website: '',
    startedAt: now - 10000,
  };

  it('accepte un payload valide et normalise les champs', () => {
    const result = validateContactPayload({ ...valid, name: '  Ada Lovelace  ' }, now);
    expect(result).toEqual({
      ok: true,
      data: { name: 'Ada Lovelace', email: 'ada@example.com', subject: 'Mission backend', message: valid.message },
    });
  });

  it('détecte le honeypot rempli comme spam', () => {
    expect(validateContactPayload({ ...valid, website: 'http://spam' }, now)).toEqual({ ok: false, spam: true });
  });

  it('détecte un envoi trop rapide comme spam', () => {
    const result = validateContactPayload({ ...valid, startedAt: now - CONTACT_LIMITS.minFillTimeMs + 1 }, now);
    expect(result).toEqual({ ok: false, spam: true });
  });

  it('rejette un horodatage absent ou expiré', () => {
    expect(validateContactPayload({ ...valid, startedAt: undefined }, now)).toEqual({ ok: false, spam: true });
    expect(validateContactPayload({ ...valid, startedAt: now - CONTACT_LIMITS.maxFillTimeMs - 1 }, now)).toEqual({
      ok: false,
      spam: true,
    });
  });

  it('renvoie une erreur par champ invalide', () => {
    const result = validateContactPayload({ ...valid, name: 'A', email: 'pas-un-email', message: 'court' }, now);
    expect(result.ok).toBe(false);
    if (!result.ok && !result.spam) {
      expect(Object.keys(result.errors).sort()).toEqual(['email', 'message', 'name']);
    }
  });

  it('limite le nombre de liens dans le message', () => {
    const message = 'Voir https://a.fr https://b.fr https://c.fr https://d.fr pour plus de détails.';
    const result = validateContactPayload({ ...valid, message }, now);
    expect(result.ok).toBe(false);
    if (!result.ok && !result.spam) expect(result.errors.message).toContain('liens');
  });

  it('rejette les caractères de contrôle', () => {
    const result = validateContactPayload({ ...valid, name: 'Ada\u0007' }, now);
    expect(result.ok).toBe(false);
  });

  it("gère une entrée qui n'est pas un objet", () => {
    expect(validateContactPayload(null, now)).toEqual({ ok: false, spam: true });
    expect(validateContactPayload('texte', now)).toEqual({ ok: false, spam: true });
  });
});

describe('contactFieldError (validateurs du formulaire client)', () => {
  it('valide les formats d’email usuels', () => {
    expect(contactFieldError('email', 'prenom.nom@domaine.fr')).toBeNull();
    expect(contactFieldError('email', 'a+b@sub.domaine.io')).toBeNull();
  });

  it('rejette les formats d’email invalides', () => {
    for (const email of ['a@b', 'a b@c.fr', '@domaine.fr', 'a@domaine.', `${'a'.repeat(250)}@d.fr`]) {
      expect(contactFieldError('email', email), email).toBe('Adresse email invalide.');
    }
    expect(contactFieldError('email', '')).toBe('Ce champ est obligatoire.');
  });

  it('applique les mêmes bornes que le serveur', () => {
    expect(contactFieldError('message', 'a'.repeat(CONTACT_LIMITS.messageMin - 1))).toContain('entre');
    expect(contactFieldError('message', 'a'.repeat(CONTACT_LIMITS.messageMin))).toBeNull();
    expect(contactFieldError('subject', '')).toBeNull();
  });
});
