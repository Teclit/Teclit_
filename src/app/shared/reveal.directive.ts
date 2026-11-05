import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';

/**
 * Animation d'apparition légère au défilement.
 * Le contenu reste visible sans JavaScript ; l'animation est désactivée
 * côté CSS quand `prefers-reduced-motion: reduce` est actif.
 */
@Directive({
  selector: '[appReveal]',
  host: { class: 'reveal' },
})
export class RevealDirective implements OnInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') return;
    const node = this.el.nativeElement;
    node.classList.add('reveal--pending');
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add('reveal--visible');
            this.observer?.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );
    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
