import { IMAGE_LOADER, type ImageLoaderConfig } from '@angular/common';
import type { Provider } from '@angular/core';

/** Largeurs générées par `npm run images` (scripts/optimize-images.mjs). */
export const IMAGE_WIDTHS = [320, 640] as const;

/**
 * `assets/projects/qcmplus.webp` (+ largeur) -> `assets/projects/qcmplus-320.avif`.
 * Utilisé par NgOptimizedImage pour produire `src` et `srcset` en AVIF.
 */
export function responsiveImageLoader({ src, width }: ImageLoaderConfig): string {
  const base = src.replace(/(-\d+)?\.(webp|png|jpe?g|avif)$/i, '');
  const target = IMAGE_WIDTHS.find((w) => w >= (width ?? Infinity)) ?? IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
  return `/${base.replace(/^\//, '')}-${target}.avif`;
}

export const provideResponsiveImages = (): Provider => ({ provide: IMAGE_LOADER, useValue: responsiveImageLoader });
