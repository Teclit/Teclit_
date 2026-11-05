import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentService } from '../core/content/content.service';
import { IconComponent } from '../shared/icon/icon.component';
import { RevealDirective } from '../shared/reveal.directive';
import { CardComponent } from '../shared/ui/card.component';
import { TagComponent } from '../shared/ui/tag.component';

/** Formations (et certifications si renseignées). */
@Component({
  selector: 'app-formation',
  imports: [IconComponent, RevealDirective, CardComponent, TagComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <ul role="list" class="grid gap-5 sm:grid-cols-2">
      @for (edu of content.education; track edu.id) {
        <li appCard appReveal class="flex gap-4">
          <span
            class="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-strong dark:text-accent"
            aria-hidden="true"
          >
            <app-icon name="graduation" />
          </span>
          <div>
            <p class="text-sm text-muted">{{ edu.period }}</p>
            <h3 class="text-h3 font-bold">{{ edu.title }}</h3>
            <p class="font-semibold text-accent">{{ edu.school }}{{ edu.location ? ' · ' + edu.location : '' }}</p>
            @if (edu.level) {
              <app-tag variant="accent" class="mt-2">{{ edu.level }}</app-tag>
            }
          </div>
        </li>
      }
    </ul>

    @if (content.certifications.length) {
      <h3 class="mb-4 mt-12 text-h3 font-bold" data-testid="certifications">Certifications</h3>
      <ul role="list" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        @for (cert of content.certifications; track cert.name) {
          <li appCard>
            <h4 class="font-bold">{{ cert.name }}</h4>
            <p class="text-sm text-muted">{{ cert.issuer }} · {{ cert.date }}</p>
            @if (cert.url) {
              <a [href]="cert.url" target="_blank" rel="noopener noreferrer" class="text-sm font-semibold text-accent"
                >Vérifier la certification</a
              >
            }
          </li>
        }
      </ul>
    }
  `,
})
export class FormationComponent {
  protected readonly content = inject(ContentService);
}
