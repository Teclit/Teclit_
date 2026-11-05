import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Project } from '../../data/profile.model';
import { IconComponent } from '../icon/icon.component';
import { CardComponent } from '../ui/card.component';
import { TagComponent } from '../ui/tag.component';

const MAX_TAGS = 5;

@Component({
  selector: 'app-project-card',
  imports: [RouterLink, NgOptimizedImage, IconComponent, CardComponent, TagComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  template: `
    @let p = project();
    <article appCard interactive padding="none" class="group flex h-full flex-col overflow-hidden">
      <div
        class="grid aspect-[16/9] place-items-center border-b border-border bg-linear-to-br from-accent-soft via-surface to-surface-2 p-6"
      >
        <img
          [ngSrc]="p.image.src"
          [width]="p.image.width"
          [height]="p.image.height"
          [alt]="p.image.alt"
          class="max-h-full w-auto rounded-md object-contain transition-transform duration-500 ease-out-expo motion-safe:group-hover:scale-105"
        />
      </div>
      <div class="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <h3 class="text-h3 font-bold">
          <a
            class="text-fg no-underline after:absolute after:inset-0 after:content-[''] hover:text-accent"
            [routerLink]="['/projets', p.slug]"
            data-testid="project-link"
            >{{ p.title }}</a
          >
        </h3>
        <p class="text-sm text-muted">{{ p.summary }}</p>
        <ul role="list" class="flex flex-wrap gap-1.5" aria-label="Stack technique">
          @for (tech of p.stack.slice(0, maxTags); track tech) {
            <li>
              <app-tag variant="outline">{{ tech }}</app-tag>
            </li>
          }
          @if (p.stack.length > maxTags) {
            <li>
              <app-tag variant="outline">+{{ p.stack.length - maxTags }}</app-tag>
            </li>
          }
        </ul>
        <p class="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-accent" aria-hidden="true">
          Voir le détail
          <app-icon
            name="arrow-right"
            [size]="16"
            class="transition-transform duration-300 motion-safe:group-hover:translate-x-1"
          />
        </p>
      </div>
    </article>
  `,
})
export class ProjectCardComponent {
  readonly project = input.required<Project>();
  protected readonly maxTags = MAX_TAGS;
}
