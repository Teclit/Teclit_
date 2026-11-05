import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApp } from './app';
import type { Mailer } from './contact';

const valid = () => ({
  name: 'Ada Lovelace',
  email: 'Ada@Example.com',
  subject: 'Mission',
  message: 'Bonjour, je souhaiterais échanger sur une mission Java.',
  website: '',
  startedAt: Date.now() - 10_000,
});

function setup(mailer: Mailer | null = vi.fn<Mailer>().mockResolvedValue(undefined), limit = 5) {
  return { app: createApp({ contact: { mailer, rateLimit: { windowMs: 60_000, limit } } }), mailer };
}

describe('Serveur Express', () => {
  it('expose /healthz', async () => {
    const res = await request(setup().app).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('envoie les en-têtes de sécurité (CSP, HSTS, X-Frame-Options, Referrer-Policy)', async () => {
    const res = await request(setup().app).get('/healthz');
    expect(res.headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(res.headers['strict-transport-security']).toContain('max-age=63072000');
    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  describe('POST /api/contact', () => {
    it('valide, normalise et envoie le message', async () => {
      const { app, mailer } = setup();
      const res = await request(app).post('/api/contact').send(valid());
      expect(res.status).toBe(200);
      expect(mailer).toHaveBeenCalledWith({
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        subject: 'Mission',
        message: valid().message,
      });
    });

    it('renvoie 400 et les erreurs par champ', async () => {
      const res = await request(setup().app)
        .post('/api/contact')
        .send({ ...valid(), email: 'invalide', message: 'court' });
      expect(res.status).toBe(400);
      expect(Object.keys(res.body.errors).sort()).toEqual(['email', 'message']);
    });

    it('ignore silencieusement le spam (honeypot)', async () => {
      const { app, mailer } = setup();
      const res = await request(app)
        .post('/api/contact')
        .send({ ...valid(), website: 'https://spam.example' });
      expect(res.status).toBe(200);
      expect(mailer).not.toHaveBeenCalled();
    });

    it('répond 503 si l’envoi n’est pas configuré, 502 si Resend échoue', async () => {
      expect((await request(setup(null).app).post('/api/contact').send(valid())).status).toBe(503);
      const failing = vi.fn<Mailer>().mockRejectedValue(new Error('down'));
      vi.spyOn(console, 'error').mockImplementation(() => undefined);
      expect((await request(setup(failing).app).post('/api/contact').send(valid())).status).toBe(502);
    });

    it('limite le débit par IP (429)', async () => {
      const { app } = setup(undefined, 2);
      await request(app).post('/api/contact').send(valid());
      await request(app).post('/api/contact').send(valid());
      const res = await request(app).post('/api/contact').send(valid());
      expect(res.status).toBe(429);
    });

    it('refuse les autres méthodes et les corps trop volumineux', async () => {
      const { app } = setup();
      expect((await request(app).get('/api/contact')).status).toBe(405);
      const big = await request(app)
        .post('/api/contact')
        .send({ ...valid(), message: 'x'.repeat(20_000) });
      expect(big.status).toBe(413);
    });
  });
});
