import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROFILE } from '../data/profile.data';
import type { ExperienceKind } from '../data/profile.model';
import { buildTimeline, findProject, type TimelineEntry } from '../data/profile.utils';
import { IconComponent } from '../shared/icon/icon.component';
import { RevealDirective } from '../shared/reveal.directive';
import { IsTodoPipe } from '../shared/todo.pipe';

export type TimelineFilter = 'tout' | 'experience' | 'education';

export const KIND_LABELS: Record<ExperienceKind, string> = {
  emploi: 'Emploi',
  alternance: 'Alternance',
  stage: 'Stage',
  projet: 'Projet',
};

/** Section « Parcours » : timeline chronologique complète (expériences + formations). */
@Component({
  selector: 'app-experiences',
  imports: [RouterLink, IconComponent, RevealDirective, IsTodoPipe],
  templateUrl: './experiences.component.html',
  styleUrl: './experiences.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperiencesComponent {
  protected readonly kindLabels = KIND_LABELS;
  private readonly timeline: TimelineEntry[] = buildTimeline(PROFILE.experiences, PROFILE.education);

  readonly filter = signal<TimelineFilter>('tout');
  readonly entries = computed(() => {
    const f = this.filter();
    return f === 'tout' ? this.timeline : this.timeline.filter((e) => e.kind === f);
  });

  protected readonly filters: { value: TimelineFilter; label: string }[] = [
    { value: 'tout', label: 'Tout' },
    { value: 'experience', label: 'Expériences' },
    { value: 'education', label: 'Formations' },
  ];

  protected projectTitle(slug: string): string {
    return findProject(PROFILE, slug)?.title ?? slug;
  }
}
