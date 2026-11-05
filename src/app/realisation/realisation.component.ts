import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ContentService } from '../core/content/content.service';
import { ProjectCardComponent } from '../shared/project-card/project-card.component';

/** Grille de projets filtrable par technologie (signal + computed), entrées animées. */
@Component({
  selector: 'app-realisation',
  imports: [ProjectCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="mb-8 flex flex-wrap items-center gap-2" role="group" aria-label="Filtrer les projets par technologie">
      <button
        type="button"
        class="min-h-10 rounded-full border px-4 text-sm font-semibold"
        [class]="tech() === null ? activeClass : idleClass"
        [attr.aria-pressed]="tech() === null"
        (click)="tech.set(null)"
      >
        Tous <span class="opacity-70">({{ content.projects.length }})</span>
      </button>
      @for (t of technologies; track t) {
        <button
          type="button"
          class="min-h-10 rounded-full border px-4 text-sm font-semibold"
          [class]="tech() === t ? activeClass : idleClass"
          [attr.aria-pressed]="tech() === t"
          (click)="toggle(t)"
        >
          {{ t }}
        </button>
      }
    </div>

    <p class="sr-only" role="status" aria-live="polite">{{ projects().length }} projet(s) affiché(s)</p>

    <ul role="list" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      @for (project of projects(); track project.slug) {
        <li animate.enter="enter-fade-up" data-testid="project-item">
          <app-project-card [project]="project" />
        </li>
      }
    </ul>
  `,
})
export class RealisationComponent {
  protected readonly content = inject(ContentService);
  protected readonly technologies = this.content.projectTechnologies;
  protected readonly activeClass = 'border-accent bg-accent text-accent-fg';
  protected readonly idleClass = 'border-border bg-surface text-muted hover:border-accent hover:text-accent';

  /** Technologie sélectionnée (null = tous les projets). */
  readonly tech = signal<string | null>(null);
  readonly projects = computed(() => {
    const t = this.tech();
    return t ? this.content.orderedProjects.filter((p) => p.stack.includes(t)) : this.content.orderedProjects;
  });

  toggle(tech: string): void {
    this.tech.update((current) => (current === tech ? null : tech));
  }
}
