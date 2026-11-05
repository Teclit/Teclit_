import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentService } from '../core/content/content.service';
import { IconComponent } from '../shared/icon/icon.component';
import { RevealDirective } from '../shared/reveal.directive';
import { CardComponent } from '../shared/ui/card.component';
import { TagComponent } from '../shared/ui/tag.component';

@Component({
  selector: 'app-apropos',
  imports: [IconComponent, RevealDirective, CardComponent, TagComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
      <div class="space-y-5 text-lg text-muted" appReveal>
        @for (paragraph of identity.longBio; track $index) {
          <p>{{ paragraph }}</p>
        }
      </div>

      <aside class="space-y-5" aria-label="En bref" appReveal>
        <dl class="grid grid-cols-3 gap-3">
          @for (fact of identity.facts; track fact.label) {
            <div appCard padding="none" class="p-4">
              <dt class="text-xs font-medium uppercase tracking-wider text-muted">{{ fact.label }}</dt>
              <dd class="mt-1 font-bold leading-snug text-fg">{{ fact.value }}</dd>
            </div>
          }
        </dl>

        <app-card class="space-y-5">
          <div>
            <h3 class="text-sm font-bold uppercase tracking-wider text-muted">Atouts</h3>
            <ul role="list" class="mt-3 flex flex-wrap gap-2">
              @for (quality of identity.qualities; track quality) {
                <li>
                  <app-tag variant="accent">{{ quality }}</app-tag>
                </li>
              }
            </ul>
          </div>
          <div>
            <h3 class="text-sm font-bold uppercase tracking-wider text-muted">Langues</h3>
            <ul role="list" class="mt-3 space-y-1">
              @for (lang of content.languages; track lang.name) {
                <li>
                  <strong>{{ lang.name }}</strong> <span class="text-muted">— {{ lang.level }}</span>
                </li>
              }
            </ul>
          </div>
          <div>
            <h3 class="text-sm font-bold uppercase tracking-wider text-muted">Infos pratiques</h3>
            <ul role="list" class="mt-3 space-y-2">
              <li class="flex items-center gap-2">
                <app-icon name="map-pin" [size]="16" class="text-accent" /> {{ identity.location }}
              </li>
              <li class="flex items-center gap-2">
                <app-icon name="check" [size]="16" class="text-accent" /> {{ identity.availability }}
              </li>
              @for (info of identity.practicalInfo; track info) {
                <li class="flex items-center gap-2">
                  <app-icon name="check" [size]="16" class="text-accent" /> {{ info }}
                </li>
              }
            </ul>
          </div>
        </app-card>
      </aside>
    </div>
  `,
})
export class AproposComponent {
  protected readonly content = inject(ContentService);
  protected readonly identity = this.content.identity;
}
