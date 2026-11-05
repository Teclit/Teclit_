import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  input,
  linkedSignal,
} from '@angular/core';

const TYPE_MS = 70;
const ERASE_MS = 35;
const HOLD_MS = 2000;

/**
 * Texte « tapé » qui fait défiler une liste d'intitulés.
 * - Serveur / sans JS / reduced-motion : premier intitulé affiché en entier.
 * - Lecteurs d'écran : liste statique (sr-only) ; la partie animée est aria-hidden.
 */
@Component({
  selector: 'app-typed-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline' },
  template: `<span class="sr-only">{{ words().join(', ') }}</span
    ><span aria-hidden="true"
      >{{ text()
      }}<span class="ml-1 inline-block h-[0.9em] w-[3px] translate-y-[0.1em] bg-accent motion-safe:animate-blink"></span
    ></span>`,
})
export class TypedTextComponent {
  readonly words = input.required<readonly string[]>();
  /** Texte affiché ; initialisé au premier intitulé (identique serveur / client). */
  protected readonly text = linkedSignal(() => this.words()[0] ?? '');

  constructor() {
    let timer: ReturnType<typeof setTimeout> | undefined;
    inject(DestroyRef).onDestroy(() => clearTimeout(timer));
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;

    afterNextRender(() => {
      const words = this.words();
      if (words.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      let index = 0;
      let chars = words[0].length;
      let phase: 'erase' | 'type' = 'erase';

      const tick = () => {
        if (phase === 'erase') {
          chars--;
          if (chars === 0) {
            index = (index + 1) % words.length;
            phase = 'type';
          }
        } else {
          chars++;
        }
        const word = words[index];
        this.text.set(word.slice(0, chars));
        if (phase === 'type' && chars === word.length) {
          phase = 'erase';
          timer = setTimeout(tick, HOLD_MS);
        } else {
          timer = setTimeout(tick, phase === 'erase' ? ERASE_MS : TYPE_MS);
        }
      };
      timer = setTimeout(tick, HOLD_MS);
    });
  }
}
