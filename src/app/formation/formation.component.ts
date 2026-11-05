import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROFILE } from '../data/profile.data';
import { IconComponent } from '../shared/icon/icon.component';
import { RevealDirective } from '../shared/reveal.directive';

/** Section « Formation et certifications ». */
@Component({
  selector: 'app-formation',
  imports: [IconComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section section--alt" id="formation" aria-labelledby="formation-title">
      <div class="container">
        <header class="section__header" appReveal>
          <span class="eyebrow">Formation</span>
          <h2 id="formation-title" class="section__title">Formation et certifications</h2>
          <p class="section__lead">
            Un cursus progressif, du Bac+2 au Bac+5 (Niveau 7), orienté développement logiciel.
          </p>
        </header>

        <ul class="grid grid--2" role="list">
          @for (edu of education; track edu.id) {
            <li class="card edu" appReveal>
              <span class="edu__icon" aria-hidden="true"><app-icon name="graduation" /></span>
              <div>
                <p class="muted edu__period">{{ edu.period }}</p>
                <h3 class="edu__title">{{ edu.title }}</h3>
                <p class="edu__school">{{ edu.school }}{{ edu.location ? ' · ' + edu.location : '' }}</p>
                @if (edu.level) {
                  <p class="chip edu__level">{{ edu.level }}</p>
                }
              </div>
            </li>
          }
        </ul>

        <h3 class="certs__title">Certifications</h3>
        @if (certifications.length) {
          <ul class="grid grid--3" role="list">
            @for (cert of certifications; track cert.name) {
              <li class="card">
                <h4>{{ cert.name }}</h4>
                <p class="muted">{{ cert.issuer }} · {{ cert.date }}</p>
                @if (cert.url) {
                  <a [href]="cert.url" target="_blank" rel="noopener noreferrer">Vérifier la certification</a>
                }
              </li>
            }
          </ul>
        } @else {
          <p><span class="todo">TODO: ajouter vos certifications dans src/app/data/profile.data.ts</span></p>
        }
      </div>
    </section>
  `,
  styles: `
    .edu {
      display: flex;
      gap: var(--sp-4);
      list-style: none;
    }
    .edu__icon {
      display: grid;
      flex-shrink: 0;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: var(--radius-sm);
      background: var(--primary-soft);
      color: var(--primary);
    }
    .edu__period {
      font-size: var(--fs-sm);
    }
    .edu__title {
      font-size: var(--fs-lg);
    }
    .edu__school {
      color: var(--primary);
      font-weight: 600;
    }
    .edu__level {
      margin-top: var(--sp-2);
    }
    .certs__title {
      margin: var(--sp-7) 0 var(--sp-4);
      font-size: var(--fs-lg);
    }
  `,
})
export class FormationComponent {
  protected readonly education = PROFILE.education;
  protected readonly certifications = PROFILE.certifications;
}
