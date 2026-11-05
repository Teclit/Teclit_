import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';

/**
 * Barre de progression de lecture. Mise à jour hors détection de changements,
 * dans un requestAnimationFrame, via `transform: scaleX()` uniquement.
 */
@Component({
  selector: 'app-scroll-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pointer-events-none fixed inset-x-0 top-0 z-60 h-0.5', 'aria-hidden': 'true' },
  template: `<div #bar class="h-full origin-left scale-x-0 bg-accent will-change-transform"></div>`,
})
export class ScrollProgressComponent {
  private readonly bar = viewChild.required<ElementRef<HTMLElement>>('bar');

  constructor() {
    const document = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;

    afterNextRender(() => {
      const el = this.bar().nativeElement;
      const root = document.documentElement;
      let frame = 0;
      const update = () => {
        frame = 0;
        const max = root.scrollHeight - root.clientHeight;
        el.style.transform = `scaleX(${max > 0 ? Math.min(root.scrollTop / max, 1) : 0})`;
      };
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(update);
      };
      addEventListener('scroll', schedule, { passive: true });
      addEventListener('resize', schedule, { passive: true });
      update();
      destroyRef.onDestroy(() => {
        removeEventListener('scroll', schedule);
        removeEventListener('resize', schedule);
        cancelAnimationFrame(frame);
      });
    });
  }
}
