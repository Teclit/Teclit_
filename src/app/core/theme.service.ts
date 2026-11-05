import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal, DOCUMENT } from '@angular/core';

export type Theme = 'light' | 'dark';
export const THEME_STORAGE_KEY = 'theme';

/**
 * Gère le thème clair / sombre. Le thème initial est appliqué avant le rendu
 * par un script inline dans `index.html` (évite le flash) ; ce service le relit.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly theme = signal<Theme>(this.readInitialTheme());

  toggle(): void {
    this.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    this.theme.set(theme);
    this.document.documentElement.setAttribute('data-theme', theme);
    if (this.isBrowser) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch {
        /* stockage indisponible : on garde le thème en mémoire */
      }
    }
  }

  private readInitialTheme(): Theme {
    const fromDom = this.document.documentElement.getAttribute('data-theme');
    if (fromDom === 'dark' || fromDom === 'light') return fromDom;
    if (this.isBrowser && typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
}
