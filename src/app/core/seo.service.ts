import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { PROFILE } from '../data/profile.data';
import { filledUrl } from '../data/profile.utils';

export interface PageSeo {
  title: string;
  description: string;
  /** Chemin de la page, ex. `/projets/qcmplus`. */
  path: string;
  image?: string;
  type?: 'website' | 'profile' | 'article';
  noindex?: boolean;
}

const SITE_NAME = `${PROFILE.identity.fullName} — Portfolio`;
const JSON_LD_ID = 'jsonld-page';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  /** URL absolue si le domaine est configuré (`identity.siteUrl`), sinon null. */
  absoluteUrl(path: string): string | null {
    const base = filledUrl(PROFILE.identity.siteUrl);
    return base ? `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}` : null;
  }

  update(page: PageSeo): void {
    const fullTitle = page.path === '/' ? page.title : `${page.title} | ${PROFILE.identity.fullName}`;
    // Tant que le domaine n'est pas configuré, on n'émet pas d'URL relative (invalide pour canonical / og:url).
    const url = this.absoluteUrl(page.path);
    const image = this.absoluteUrl(page.image ?? '/og-image.png') ?? page.image ?? '/og-image.png';

    this.title.setTitle(fullTitle);
    this.setName('description', page.description);
    this.setName('robots', page.noindex ? 'noindex, nofollow' : 'index, follow');
    this.setProperty('og:title', fullTitle);
    this.setProperty('og:description', page.description);
    this.setProperty('og:type', page.type ?? 'website');
    if (url) this.setProperty('og:url', url);
    this.setProperty('og:image', image);
    this.setProperty('og:site_name', SITE_NAME);
    this.setProperty('og:locale', 'fr_FR');
    this.setName('twitter:card', 'summary_large_image');
    this.setName('twitter:title', fullTitle);
    this.setName('twitter:description', page.description);
    this.setName('twitter:image', image);
    if (url) this.setCanonical(url);
  }

  /** Remplace les données structurées JSON-LD propres à la page. */
  setJsonLd(data: Record<string, unknown> | null): void {
    const head = this.document.head;
    head.querySelector(`#${JSON_LD_ID}`)?.remove();
    if (!data) return;
    const script = this.document.createElement('script');
    script.id = JSON_LD_ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
    head.appendChild(script);
  }

  private setName(name: string, content: string): void {
    this.meta.updateTag({ name, content }, `name="${name}"`);
  }

  private setProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content }, `property="${property}"`);
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = url;
  }
}
