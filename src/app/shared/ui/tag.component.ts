import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type TagVariant = 'soft' | 'outline' | 'accent';

const BASE = 'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-0.5 text-xs font-medium';
const VARIANTS: Record<TagVariant, string> = {
  soft: 'bg-surface-2 text-fg',
  outline: 'border border-border text-muted',
  accent: 'bg-accent-soft text-accent-strong dark:text-accent',
};

/** Étiquette (technologie, type de contrat, qualité…). */
@Component({
  selector: 'app-tag',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: '<ng-content />',
})
export class TagComponent {
  readonly variant = input<TagVariant>('soft');
  protected readonly classes = computed(() => `${BASE} ${VARIANTS[this.variant()]}`);
}
