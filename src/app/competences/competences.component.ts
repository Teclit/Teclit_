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
        <li
          class="group relative isolate flex flex-col items-center gap-2 rounded-2xl border border-transparent p-3 text-center text-xs text-muted transition-[background-color,border-color,color] duration-300 hover:border-accent/30 hover:bg-accent-soft/40 hover:text-fg"
        >
          <!-- Halo lumineux derrière le logo -->
          <span
            class="pointer-events-none absolute left-1/2 top-3 -z-10 size-14 -translate-x-1/2 rounded-full bg-accent opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-50"
            aria-hidden="true"
          ></span>
          <span
            class="relative grid after:pointer-events-none after:absolute after:inset-0 after:-translate-x-[120%] after:bg-[linear-gradient(115deg,transparent_30%,color-mix(in_srgb,var(--accent)_28%,transparent)_50%,transparent_70%)] after:content-[''] motion-safe:group-hover:after:translate-x-[120%] motion-safe:group-hover:after:transition-[translate] motion-safe:group-hover:after:duration-700 size-12 place-items-center overflow-hidden rounded-xl bg-white p-2 shadow-card ring-1 ring-black/5 transition-[translate,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:shadow-lift group-hover:ring-2 group-hover:ring-accent motion-safe:group-hover:-translate-y-1.5"
          >
            <img
              [src]="tech.src"
              alt=""
              width="50"
              height="50"
              loading="lazy"
              decoding="async"
              class="size-8 object-contain opacity-90 grayscale-[35%] transition-[scale,rotate,filter,opacity] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:opacity-100 group-hover:grayscale-0 motion-safe:group-hover:-rotate-6 motion-safe:group-hover:scale-115"
            />
          </span>
          <span
            class="font-medium transition-[color,translate] duration-300 group-hover:text-accent-strong motion-safe:group-hover:-translate-y-0.5 dark:group-hover:text-accent"
            >{{ tech.name }}</span
          >
        </li>
      }
    </ul>
  `,
})
export class CompetencesComponent {
  protected readonly content = inject(ContentService);
}
