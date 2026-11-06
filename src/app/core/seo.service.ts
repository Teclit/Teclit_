import { Injectable, inject, DOCUMENT } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { PROFILE } from './content/content.service';
import { filledUrl } from '../data/profile.utils';
import { OG_IMAGE_FILE } from './og-image.generated';

/**
 * Image de partage. Les dimensions sont obligatoires : sans `og:image:width/height`,
 * WhatsApp, LinkedIn, Messenger ou Teams retombent sur la vignette compacte (image à gauche)
 * tant qu'ils n'ont pas téléchargé l'image ; avec, ils affichent d'emblée la grande carte
 * (image pleine largeur en haut, titre + description en dessous).
 */
export interface SeoImage {
  /** Chemin local (`/og-image.jpg`) ou URL absolue. */
  url: string;
  width: number;
  height: number;
  alt: string;
  type?: string;
}

export interface PageSeo {
  title: string;
  description: string;
  /** Chemin de la page, ex. `/projets/qcmplus`. */
  path: string;
  /** Image propre à la page ; par défaut `public/og-image.jpg`. */
  image?: SeoImage;
  type?: 'website' | 'profile' | 'article';
  noindex?: boolean;
}

/**
 * Image de partage par défaut : `public/og-image.jpg` telle quelle. Dimensions et version
 * sont relues sur le fichier à chaque build (`scripts/generate-seo.mjs`).
 */
export const DEFAULT_OG_IMAGE: SeoImage = {
  url: OG_IMAGE_FILE.path,
  width: OG_IMAGE_FILE.width,
  height: OG_IMAGE_FILE.height,
  type: OG_IMAGE_FILE.type,
  alt: `${PROFILE.identity.fullName}, développeur Full Stack — photo de profil et présentation du portfolio`,
};

const SITE_NAME = `${PROFILE.identity.fullName} — Portfolio`;
const JSON_LD_ID = 'jsonld-page';
/** Longueur au-delà de laquelle les cartes tronquent la description (Facebook, LinkedIn, X). */
const SOCIAL_DESCRIPTION_MAX = 200;

/** Attribut de sélection d'une balise : `property` pour Open Graph, `name` pour le reste. */
type MetaTag = { name: string; content: string } | { property: string; content: string };

/**
 * Balises conditionnelles (type de page, domaine) : retirées avant chaque mise à jour
 * (navigation côté client), sinon une page projet hériterait de `profile:*`.
 */
const CONDITIONAL_TAGS = ['profile:first_name', 'profile:last_name', 'article:author', 'og:url'];

/** Tronque sur une frontière de mot, avec points de suspension. */
export function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max / 2)).replace(/[\s,;:.—-]+$/, '')}…`;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  /** URL absolue si le domaine est configuré (`identity.siteUrl`), sinon null. */
  absoluteUrl(path: string): string | null {
    if (/^https?:\/\//.test(path)) return path;
    const base = filledUrl(PROFILE.identity.siteUrl);
    return base ? `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}` : null;
  }

  update(page: PageSeo): void {
    const fullTitle = page.path === '/' ? page.title : `${page.title} | ${PROFILE.identity.fullName}`;
    // Tant que le domaine n'est pas configuré, on n'émet pas d'URL relative (invalide pour canonical / og:url).
    const url = this.absoluteUrl(page.path);

    this.title.setTitle(fullTitle);
    for (const property of CONDITIONAL_TAGS) this.meta.removeTag(`property="${property}"`);
    for (const tag of this.buildTags(page, fullTitle, url)) {
      const selector = 'property' in tag ? `property="${tag.property}"` : `name="${tag.name}"`;
      this.meta.updateTag(tag as MetaDefinition, selector);
    }
    this.setCanonical(url);
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

  /** Ensemble complet des balises d'une page, dans l'ordre attendu par les robots. */
  private buildTags(page: PageSeo, fullTitle: string, url: string | null): MetaTag[] {
    const image = page.image ?? DEFAULT_OG_IMAGE;
    const imageUrl = this.absoluteUrl(image.url) ?? image.url;
    const type = page.type ?? 'website';
    const social = truncate(page.description, SOCIAL_DESCRIPTION_MAX);
    const og = (property: string, content: string): MetaTag => ({ property, content });
    const named = (name: string, content: string): MetaTag => ({ name, content });

    const tags: MetaTag[] = [
      named('description', page.description),
      named('robots', page.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'),

      og('og:type', type),
      og('og:site_name', SITE_NAME),
      og('og:locale', 'fr_FR'),
      og('og:title', fullTitle),
      og('og:description', social),
      ...(url ? [og('og:url', url)] : []),

      // Grande carte : image pleine largeur en haut, titre et description en dessous.
      og('og:image', imageUrl),
      ...(imageUrl.startsWith('https://') ? [og('og:image:secure_url', imageUrl)] : []),
      og('og:image:type', image.type ?? 'image/jpeg'),
      og('og:image:width', String(image.width)),
      og('og:image:height', String(image.height)),
      og('og:image:alt', image.alt),

      named('twitter:card', 'summary_large_image'),
      named('twitter:title', fullTitle),
      named('twitter:description', social),
      named('twitter:image', imageUrl),
      named('twitter:image:alt', image.alt),
    ];

    if (type === 'profile') {
      tags.push(
        og('profile:first_name', PROFILE.identity.firstName),
        og('profile:last_name', PROFILE.identity.lastName),
      );
    }
    const home = this.absoluteUrl('/');
    if (type === 'article' && home) tags.push(og('article:author', home));
    return tags;
  }

  private setCanonical(url: string | null): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!url) {
      link?.remove();
      return;
    }
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = url;
  }
}
