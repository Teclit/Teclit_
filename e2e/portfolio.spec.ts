import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Accueil', () => {
  test('affiche le hero, les sections et les CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Teklit TEWOLDE/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Teklit TEWOLDE');
    await expect(page.getByRole('link', { name: 'Voir les projets' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Télécharger le CV' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Me contacter' })).toBeVisible();
    for (const id of ['a-propos', 'parcours', 'competences', 'projets', 'formation', 'contact']) {
      await expect(page.locator(`section#${id}`)).toHaveCount(1);
    }
  });

  test('est pré-rendue avec métadonnées SEO et JSON-LD', async ({ request }) => {
    const html = await (await request.get('/')).text();
    expect(html).toContain('<h1');
    expect(html).toContain('property="og:title"');
    expect(html).toContain('"@type":"Person"');
  });

  test('filtre la timeline du parcours', async ({ page }) => {
    await page.goto('/#parcours');
    const items = page.locator('.timeline__item');
    const total = await items.count();
    await page.getByRole('button', { name: 'Formations' }).click();
    await expect(items).toHaveCount(5);
    await page.getByRole('button', { name: 'Tout' }).click();
    await expect(items).toHaveCount(total);
  });

  test('bascule et mémorise le thème', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'light');
    await page.getByRole('button', { name: 'Thème sombre' }).click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });

  test('ne présente pas de violation d’accessibilité (WCAG A/AA)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });
});

test.describe('Projets', () => {
  test('ouvre la page détail depuis une carte', async ({ page }) => {
    await page.goto('/');
    await page.locator('#projets').getByRole('link', { name: 'QCMPLUS' }).click();
    await expect(page).toHaveURL(/\/projets\/qcmplus$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('QCMPLUS');
    for (const name of ['Problème', 'Solution', 'Architecture', 'Stack technique']) {
      await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
    }
    // Résultats encore à compléter (TODO) : bloc masqué en production
    await expect(page.getByRole('heading', { level: 2, name: 'Résultats' })).toHaveCount(0);
    await expect(page).toHaveTitle(/QCMPLUS/);
  });

  test('page détail accessible', async ({ page }) => {
    await page.goto('/projets/assistant-virtuel-sncf');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test('affiche une 404 pour un projet inconnu', async ({ page }) => {
    await page.goto('/projets/inconnu');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page introuvable');
  });
});

test.describe('Contact', () => {
  test('valide les champs côté client', async ({ page }) => {
    await page.goto('/#contact');
    await page.getByRole('button', { name: 'Envoyer le message' }).click();
    await expect(page.locator('.field__error')).toHaveCount(3);
    await expect(page.getByLabel('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  test('envoie le message et affiche la confirmation', async ({ page }) => {
    let body: Record<string, unknown> = {};
    await page.route('**/api/contact', async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill({ status: 200, json: { ok: true } });
    });
    await page.goto('/#contact');
    await page.getByLabel('Nom').fill('Ada Lovelace');
    await page.getByLabel('Email').fill('ada@example.com');
    await page.getByLabel('Message').fill('Bonjour, je souhaite échanger au sujet d’une mission backend.');
    await page.getByRole('button', { name: 'Envoyer le message' }).click();
    await expect(page.getByRole('status')).toContainText('bien été envoyé');
    expect(body['website']).toBe('');
    expect(typeof body['startedAt']).toBe('number');
  });

  test('propose un repli email si l’API est indisponible', async ({ page }) => {
    await page.goto('/#contact');
    await page.getByLabel('Nom').fill('Ada Lovelace');
    await page.getByLabel('Email').fill('ada@example.com');
    await page.getByLabel('Message').fill('Bonjour, je souhaite échanger au sujet d’une mission backend.');
    await page.getByRole('button', { name: 'Envoyer le message' }).click();
    await expect(page.getByRole('status').getByRole('link')).toHaveAttribute('href', 'mailto:tewoldeteklit@gmail.com');
  });
});

test.describe('CV et navigation', () => {
  test('la page CV propose les options de téléchargement', async ({ page }) => {
    await page.goto('/cv');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Télécharger mon CV');
    await expect(page.getByRole('link', { name: /CV en ligne/ })).toHaveAttribute('href', /cvdesignr/);
    await expect(page.getByRole('button', { name: /Imprimer/ })).toBeVisible();
  });

  test('le lien d’évitement mène au contenu', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Navigation clavier testée sur desktop');
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Aller au contenu' });
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#contenu$/);
  });

  test('le menu mobile s’ouvre et navigue', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Menu burger uniquement sur mobile');
    await page.goto('/');
    const burger = page.getByRole('button', { name: 'Menu' });
    await burger.click();
    await expect(burger).toHaveAttribute('aria-expanded', 'true');
    await page
      .getByRole('navigation', { name: 'Navigation principale' })
      .getByRole('link', { name: 'Projets' })
      .click();
    await expect(burger).toHaveAttribute('aria-expanded', 'false');
    await expect(page).toHaveURL(/#projets$/);
  });
});

test.describe('Build de production', () => {
  const pages = ['/', '/cv', '/projets/cs-le-club', '/projets/tech-365', '/projets/qcmplus'];
  for (const path of pages) {
    test(`aucun placeholder TODO visible sur ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('body')).not.toContainText('TODO');
      await expect(page.locator('.todo')).toHaveCount(0);
    });
  }
});
