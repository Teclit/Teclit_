import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, PLATFORM_ID, afterNextRender, inject } from '@angular/core';
import { DestroyRef } from '@angular/core';

/**
 * Apparition au défilement (IntersectionObserver). Le contenu reste visible
 * sans JavaScript et côté serveur ; l'animation (opacity / transform) est
 * neutralisée en CSS sous `prefers-reduced-motion: reduce`.
 * Les éléments déjà visibles au chargement ne sont pas masqués (pas de flash ni de CLS).
 */
@Directive({ selector: '[appReveal]' })
export class RevealDirective {
  constructor() {
    const node = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;

    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined') return;
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight) return; // déjà à l'écran
      node.classList.add('reveal-pending');
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            node.classList.add('reveal-visible');
            observer.disconnect();
          }
        },
        { rootMargin: '0px 0px -8% 0px' },
      );
      observer.observe(node);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
