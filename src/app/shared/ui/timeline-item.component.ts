import { ChangeDetectionStrategy, Component, booleanAttribute, input, signal } from '@angular/core';
import type { IconName } from '../../data/profile.model';
import { IconComponent } from '../icon/icon.component';
import { CardComponent } from './card.component';
import { TagComponent } from './tag.component';

let nextId = 0;

/**
 * Entrée de timeline : marqueur, carte (titre, organisation, période, badge),
 * résumé projeté, et détails dépliables (`[details]`), rendus côté serveur
 * (SEO) mais masqués tant qu'ils ne sont pas ouverts.
 */
@Component({
  selector: 'app-timeline-item',
  imports: [IconComponent, CardComponent, TagComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative block pl-12 sm:pl-16' },
  template: `
    <span
      class="absolute left-0 top-5 grid size-9 place-items-center rounded-full border border-border bg-surface text-accent shadow-card sm:left-2"
      aria-hidden="true"
    >
      <app-icon [name]="icon()" [size]="16" />
    </span>
    <article appCard>
      <header class="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div class="min-w-0">
          <h3 class="text-h3 font-bold text-fg">{{ heading() }}</h3>
          <p class="font-semibold text-accent">{{ org() }}</p>
        </div>
        <div class="flex flex-col items-start gap-1 sm:items-end">
          <app-tag [variant]="badgeVariant()">{{ badge() }}</app-tag>
          <p class="text-sm text-muted">{{ period() }}</p>
        </div>
      </header>

      <div class="mt-3 text-muted"><ng-content /></div>

      @if (expandable()) {
        <button
          type="button"
          class="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-full text-sm font-semibold text-accent hover:text-accent-strong"
          [attr.aria-expanded]="open()"
          [attr.aria-controls]="detailsId"
          (click)="open.set(!open())"
        >
          {{ open() ? 'Masquer les détails' : 'Missions, objectifs et stack' }}
          <app-icon
            name="chevron-down"
            [size]="16"
            class="transition-transform duration-300 ease-out-expo"
            [class.rotate-180]="open()"
          />
        </button>
        <div [id]="detailsId" class="motion-safe:animate-fade-up" [hidden]="!open()">
          <ng-content select="[details]" />
        </div>
      }
    </article>
  `,
})
export class TimelineItemComponent {
  readonly heading = input.required<string>();
  readonly org = input.required<string>();
  readonly period = input.required<string>();
  readonly badge = input.required<string>();
  readonly badgeVariant = input<'accent' | 'outline'>('accent');
  readonly icon = input<IconName>('briefcase');
  readonly expandable = input(false, { transform: booleanAttribute });

  readonly open = signal(false);
  protected readonly detailsId = `timeline-details-${nextId++}`;
}
