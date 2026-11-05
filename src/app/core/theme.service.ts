import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, DestroyRef, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';
export const THEME_STORAGE_KEY = 'theme';

/**
 * Thème clair / sombre basé sur un signal, persisté dans localStorage.
 * Le thème initial est posé avant le rendu par un script inline (`index.html`,
 * aucun flash) ; ce service le relit puis suit la préférence système tant que
 * l'utilisateur n'a pas fait de choix explicite.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly _theme = signal<Theme>(this.readInitialTheme());
  readonly theme = this._theme.asReadonly();

  constructor() {
    if (!this.isBrowser || typeof matchMedia !== 'function') return;
    const media = matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      if (!this.storedTheme()) this.apply(e.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', onChange);
    inject(DestroyRef).onDestroy(() => media.removeEventListener('change', onChange));
  }

  toggle(): void {
    this.set(this._theme() === 'dark' ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    this.apply(theme);
    if (this.isBrowser) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch {
        /* stockage indisponible : le thème reste en mémoire */
      }
    }
  }

  private apply(theme: Theme): void {
    this._theme.set(theme);
    this.document.documentElement.setAttribute('data-theme', theme);
  }

  private storedTheme(): Theme | null {
    try {
      const value = localStorage.getItem(THEME_STORAGE_KEY);
      return value === 'dark' || value === 'light' ? value : null;
    } catch {
      return null;
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
