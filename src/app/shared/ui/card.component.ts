import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';

const BASE = 'block rounded-card border border-border bg-surface shadow-card';
const PADDING = { none: '', md: 'p-5 sm:p-6' } as const;
const INTERACTIVE =
  'relative transition-transform duration-300 ease-out-expo hover:border-accent/60 hover:shadow-lift ' +
  'focus-within:border-accent/60 motion-safe:hover:-translate-y-1';

/**
 * Carte du design system. Utilisable en élément (`<app-card>`) ou en attribut
 * sur un élément sémantique (`<article appCard>`, `<form appCard>`, `<li appCard>`).
 */
@Component({
  selector: 'app-card, [appCard]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: '<ng-content />',
})
export class CardComponent {
  readonly interactive = input(false, { transform: booleanAttribute });
  readonly padding = input<keyof typeof PADDING>('md');
  protected readonly classes = computed(
    () => `${BASE} ${PADDING[this.padding()]} ${this.interactive() ? INTERACTIVE : ''}`,
  );
}
