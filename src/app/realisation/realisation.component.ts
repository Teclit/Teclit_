import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROFILE } from '../data/profile.data';
import { ProjectCardComponent } from '../shared/project-card/project-card.component';
import { RevealDirective } from '../shared/reveal.directive';

/** Section « Projets » : cartes vers les pages de détail. */
@Component({
  selector: 'app-realisation',
  imports: [ProjectCardComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section" id="projets" aria-labelledby="projets-title">
      <div class="container">
        <header class="section__header" appReveal>
          <span class="eyebrow">Projets</span>
          <h2 id="projets-title" class="section__title">Réalisations</h2>
          <p class="section__lead">
            Projets professionnels, académiques et de stage : problème, solution, architecture et stack.
          </p>
        </header>
        <ul class="grid grid--3" role="list">
          @for (project of projects; track project.slug) {
            <li appReveal><app-project-card [project]="project" /></li>
          }
        </ul>
      </div>
    </section>
  `,
  styles: `
    li {
      list-style: none;
    }
  `,
})
export class RealisationComponent {
  /** Projets mis en avant d'abord, puis les autres (ordre du fichier de données conservé). */
  protected readonly projects = [
    ...PROFILE.projects.filter((p) => p.featured),
    ...PROFILE.projects.filter((p) => !p.featured),
  ];
}
