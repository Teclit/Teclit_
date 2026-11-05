import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

/**
 * Section actuellement visible (surlignage du lien actif dans la navbar).
 * Une bande horizontale au milieu de l'écran sert de « ligne de lecture ».
 */
@Injectable({ providedIn: 'root' })
export class ScrollSpyService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private observer?: IntersectionObserver;

  private readonly _activeId = signal<string | null>(null);
  readonly activeId = this._activeId.asReadonly();

  observe(ids: readonly string[]): void {
    this.disconnect();
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') return;
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) this._activeId.set(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const id of ids) {
      const el = this.document.getElementById(id);
      if (el) this.observer.observe(el);
    }
  }

  disconnect(): void {
    this.observer?.disconnect();
    this.observer = undefined;
    this._activeId.set(null);
  }
}
