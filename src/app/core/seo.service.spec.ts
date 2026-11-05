import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta } from '@angular/platform-browser';
import { PROFILE } from './content/content.service';
import { DEFAULT_OG_IMAGE, SeoService, truncate } from './seo.service';

describe('SeoService', () => {
  let seo: SeoService;
  let meta: Meta;
  const prop = (p: string) => meta.getTag(`property="${p}"`)?.content;
  const name = (n: string) => meta.getTag(`name="${n}"`)?.content;
  const base = PROFILE.identity.siteUrl.replace(/\/$/, '');

  beforeEach(() => {
    seo = TestBed.inject(SeoService);
    meta = TestBed.inject(Meta);
  });

  it('émet la grande carte (image pleine largeur) avec dimensions explicites', () => {
    seo.update({ title: 'Accueil', description: 'Desc', path: '/' });
    expect(prop('og:type')).toBe('website');
    expect(name('twitter:card')).toBe('summary_large_image');
    expect(prop('og:image')).toBe(`${base}${DEFAULT_OG_IMAGE.url}`);
    expect(prop('og:image')).toMatch(/^https:\/\/.+\/og-image\.jpg\?v=[0-9a-f]{8}$/);
    expect(prop('og:image:secure_url')).toBe(prop('og:image'));
    expect(prop('og:image:width')).toBe('1200');
    expect(prop('og:image:height')).toBe('630');
    expect(prop('og:image:type')).toBe('image/jpeg');
    expect(prop('og:image:alt')).toContain(PROFILE.identity.fullName);
    expect(name('twitter:title')).toBe(prop('og:title'));
    expect(name('twitter:description')).toBe(prop('og:description'));
    expect(name('twitter:image')).toBe(prop('og:image'));
    expect(prop('og:url')).toBe(`${base}/`);
    expect(TestBed.inject(DOCUMENT).querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(`${base}/`);
    expect(name('robots')).toContain('max-image-preview:large');
  });

  it('garde les dimensions pour une image propre à la page', () => {
    seo.update({
      title: 'Projet',
      description: 'Desc',
      path: '/projets/x',
      image: { url: '/assets/x.jpg', width: 1600, height: 840, alt: 'X', type: 'image/jpeg' },
    });
    expect(prop('og:image')).toBe(`${base}/assets/x.jpg`);
    expect(prop('og:image:width')).toBe('1600');
    expect(prop('og:image:height')).toBe('840');
    expect(prop('og:image:type')).toBe('image/jpeg');
  });

  it('retire les balises propres au type précédent lors de la navigation', () => {
    seo.update({ title: 'Accueil', description: 'Desc', path: '/', type: 'profile' });
    expect(prop('profile:first_name')).toBe(PROFILE.identity.firstName);
    seo.update({ title: 'Projet', description: 'Desc', path: '/projets/x', type: 'article' });
    expect(prop('profile:first_name')).toBeUndefined();
    expect(prop('article:author')).toBe(`${base}/`);
    expect(meta.getTags('property="og:image"').length).toBe(1);
  });

  it('tronque la description sociale sur une frontière de mot', () => {
    expect(truncate('court', 200)).toBe('court');
    const out = truncate('mot '.repeat(80), 200);
    expect(out.length).toBeLessThanOrEqual(200);
    expect(out.endsWith('mot…')).toBe(true);
  });
});
