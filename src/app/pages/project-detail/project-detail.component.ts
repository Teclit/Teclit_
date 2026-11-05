import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { PROFILE } from '../../data/profile.data';
import { findExperience, findProject } from '../../data/profile.utils';
import { IconComponent } from '../../shared/icon/icon.component';
import { IsTodoPipe } from '../../shared/todo.pipe';
import { NotFoundComponent } from '../not-found/not-found.component';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink, IconComponent, IsTodoPipe, NotFoundComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailComponent {
  private readonly seo = inject(SeoService);

  /** Paramètre de route `:slug` (lié via `withComponentInputBinding`). */
  readonly slug = input<string>();

  readonly project = computed(() => findProject(PROFILE, this.slug()));
  readonly experience = computed(() => findExperience(PROFILE, this.project()?.experienceId));
  readonly siblings = computed(() => {
    const current = this.project();
    if (!current) return { previous: undefined, next: undefined };
    const list = PROFILE.projects;
    const i = list.indexOf(current);
    return {
      previous: list[(i - 1 + list.length) % list.length],
      next: list[(i + 1) % list.length],
    };
  });

  constructor() {
    effect(() => {
      const p = this.project();
      if (p) {
        this.seo.update({
          title: `${p.title} — Projet`,
          description: p.summary,
          path: `/projets/${p.slug}`,
          type: 'article',
        });
      }
    });
  }
}
