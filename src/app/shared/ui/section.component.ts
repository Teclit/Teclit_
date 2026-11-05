import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';
import type { SectionCopy } from '../../data/profile.model';
import { RevealDirective } from '../reveal.directive';

/**
 * Section de page : ancre, sur-titre, titre (h2), chapô, puis contenu projeté.
 * L'ancre (`#id`) et l'en-tête sont toujours rendus, même quand le contenu est
 * différé (`@defer`) : la navigation par fragment et le scroll-spy fonctionnent.
 */
@Component({
  selector: 'app-section',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <section
      [id]="anchor()"
      [attr.aria-labelledby]="titleId()"
      class="py-section"
      [class]="alt() ? 'border-y border-border bg-surface-2/50' : ''"
    >
      <div class="container-page">
        <header class="mb-10 max-w-2xl sm:mb-14" appReveal>
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-accent">{{ copy().eyebrow }}</p>
          <h2 [id]="titleId()" class="mt-3 text-h2 font-extrabold text-fg">{{ copy().title }}</h2>
          @if (copy().lead) {
            <p class="mt-4 text-lg text-muted">{{ copy().lead }}</p>
          }
        </header>
        <ng-content />
      </div>
    </section>
  `,
})
export class SectionComponent {
  readonly anchor = input.required<string>();
  readonly copy = input.required<SectionCopy>();
  readonly alt = input(false, { transform: booleanAttribute });
  protected readonly titleId = computed(() => `${this.anchor()}-title`);
}
