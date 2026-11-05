import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentService } from '../core/content/content.service';
import { IconComponent } from '../shared/icon/icon.component';
import { RevealDirective } from '../shared/reveal.directive';
import { CardComponent } from '../shared/ui/card.component';
import { TagComponent } from '../shared/ui/tag.component';

/** Compétences regroupées par catégorie + logos des technologies. */
@Component({
  selector: 'app-competences',
  imports: [IconComponent, RevealDirective, CardComponent, TagComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <ul role="list" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      @for (group of content.skillGroups; track group.id) {
        <li appCard interactive appReveal>
          <span
            class="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent-strong dark:text-accent"
            aria-hidden="true"
          >
            <app-icon [name]="group.icon" [size]="22" />
          </span>
          <h3 class="mt-4 text-h3 font-bold">{{ group.title }}</h3>
          <p class="mt-1 text-sm text-muted">{{ group.description }}</p>
          <ul role="list" class="mt-4 flex flex-wrap gap-1.5" [attr.aria-label]="'Compétences ' + group.title">
            @for (skill of group.skills; track skill) {
              <li>
                <app-tag>{{ skill }}</app-tag>
              </li>
            }
          </ul>
        </li>
      }
    </ul>

    <h3 class="mt-16 text-center text-sm font-bold uppercase tracking-[0.18em] text-muted">
      Technologies et outils utilisés
    </h3>
    <ul role="list" class="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-8">
      @for (tech of content.techLogos; track tech.name) {
        <li class="flex flex-col items-center gap-2 rounded-xl p-3 text-center text-xs text-muted">
          <span class="grid size-12 place-items-center rounded-xl bg-white p-2 shadow-card">
            <img
              [src]="tech.src"
              alt=""
              width="40"
              height="40"
              loading="lazy"
              decoding="async"
              class="size-8 object-contain"
            />
          </span>
          <span>{{ tech.name }}</span>
        </li>
      }
    </ul>
  `,
})
export class CompetencesComponent {
  protected readonly content = inject(ContentService);
}
