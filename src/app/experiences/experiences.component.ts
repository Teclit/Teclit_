import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content/content.service';
import type { ExperienceKind } from '../data/profile.model';
import { WithContentPipe } from '../shared/content.pipe';
import { TagComponent } from '../shared/ui/tag.component';
import { TimelineItemComponent } from '../shared/ui/timeline-item.component';

export type TimelineFilter = 'tout' | 'experience' | 'education';

export const KIND_LABELS: Record<ExperienceKind, string> = {
  emploi: 'Emploi',
  alternance: 'Alternance',
  stage: 'Stage',
  projet: 'Projet',
};

/** Timeline interactive du parcours (expériences + formations), filtrable, détails dépliables. */
@Component({
  selector: 'app-experiences',
  imports: [RouterLink, TagComponent, TimelineItemComponent, WithContentPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div
      class="mb-8 inline-flex flex-wrap gap-1 rounded-full border border-border bg-surface p-1"
      role="group"
      aria-label="Filtrer le parcours"
    >
      @for (f of filters; track f.value) {
        <button
          type="button"
          class="min-h-10 rounded-full px-4 text-sm font-semibold"
          [class]="filter() === f.value ? 'bg-accent text-accent-fg' : 'text-muted hover:text-fg'"
          [attr.aria-pressed]="filter() === f.value"
          (click)="filter.set(f.value)"
        >
          {{ f.label }}
        </button>
      }
    </div>

    <ol
      role="list"
      class="relative space-y-6 before:absolute before:inset-y-2 before:left-[1.125rem] before:w-px before:bg-border sm:before:left-[1.625rem]"
    >
      @for (entry of entries(); track entry.key) {
        <li animate.enter="enter-fade-up" data-testid="timeline-entry">
          @switch (entry.kind) {
            @case ('experience') {
              @let exp = entry.item;
              <app-timeline-item
                [heading]="exp.role"
                [org]="exp.company + (exp.location ? ' · ' + exp.location : '')"
                [period]="exp.period"
                [badge]="kindLabels[exp.kind]"
                icon="briefcase"
                expandable
              >
                <p>{{ exp.context }}</p>
                <ul role="list" class="mt-4 flex flex-wrap gap-1.5" aria-label="Stack technique">
                  @for (tech of exp.stack; track tech) {
                    <li>
                      <app-tag variant="outline">{{ tech }}</app-tag>
                    </li>
                  }
                </ul>

                <div details class="mt-4 space-y-4 border-t border-border pt-4 text-fg">
                  @if (exp.goals) {
                    <div>
                      <h4 class="font-bold">Objectifs et enjeux</h4>
                      <p class="mt-1 text-muted">{{ exp.goals }}</p>
                    </div>
                  }
                  <div>
                    <h4 class="font-bold">Missions et réalisations</h4>
                    <ul class="mt-2 list-disc space-y-1.5 pl-5 text-muted marker:text-accent">
                      @for (mission of exp.missions; track $index) {
                        <li>{{ mission }}</li>
                      }
                    </ul>
                  </div>
                  @let achievements = exp.achievements | withContent;
                  @if (achievements.length) {
                    <div>
                      <h4 class="font-bold">Réalisations chiffrées</h4>
                      <ul class="mt-2 list-disc space-y-1.5 pl-5 text-muted marker:text-accent">
                        @for (a of achievements; track $index) {
                          <li>{{ a }}</li>
                        }
                      </ul>
                    </div>
                  }
                  <div>
                    <h4 class="font-bold">Compétences démontrées</h4>
                    <p class="mt-1 text-muted">{{ exp.demonstratedSkills.join(' · ') }}</p>
                  </div>
                  @if (exp.projectSlugs.length) {
                    <p>
                      <span class="font-bold">Projets :</span>
                      @for (slug of exp.projectSlugs; track slug; let last = $last) {
                        <a [routerLink]="['/projets', slug]" class="font-medium text-accent">{{ projectTitle(slug) }}</a
                        >{{ last ? '' : ', ' }}
                      }
                    </p>
                  }
                </div>
              </app-timeline-item>
            }
            @case ('education') {
              @let edu = entry.item;
              <app-timeline-item
                [heading]="edu.title"
                [org]="edu.school + (edu.location ? ' · ' + edu.location : '')"
                [period]="edu.period"
                badge="Formation"
                badgeVariant="outline"
                icon="graduation"
              >
                @if (edu.level) {
                  <p>{{ edu.level }}</p>
                }
              </app-timeline-item>
            }
          }
        </li>
      }
    </ol>
  `,
})
export class ExperiencesComponent {
  private readonly content = inject(ContentService);
  protected readonly kindLabels = KIND_LABELS;

  readonly filter = signal<TimelineFilter>('tout');
  readonly entries = computed(() => {
    const f = this.filter();
    return f === 'tout' ? this.content.timeline : this.content.timeline.filter((e) => e.kind === f);
  });

  protected readonly filters: { value: TimelineFilter; label: string }[] = [
    { value: 'tout', label: 'Tout' },
    { value: 'experience', label: 'Expériences' },
    { value: 'education', label: 'Formations' },
  ];

  protected projectTitle(slug: string): string {
    return this.content.project(slug)?.title ?? slug;
  }
}
