import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Project } from '../../data/profile.model';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-project-card',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let p = project();
    <article class="card pcard">
      <div class="pcard__media">
        <img
          [src]="p.image.src"
          [alt]="p.image.alt"
          [width]="p.image.width"
          [height]="p.image.height"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div class="pcard__body">
        <h3 class="pcard__title">
          <a class="pcard__link" [routerLink]="['/projets', p.slug]">{{ p.title }}</a>
        </h3>
        <p class="muted pcard__summary">{{ p.summary }}</p>
        <ul class="chips" role="list" aria-label="Stack technique">
          @for (tech of p.stack.slice(0, maxChips); track tech) {
            <li class="chip chip--outline">{{ tech }}</li>
          }
          @if (p.stack.length > maxChips) {
            <li class="chip chip--outline">+{{ p.stack.length - maxChips }}</li>
          }
        </ul>
        <p class="pcard__more" aria-hidden="true">Voir le détail <app-icon name="arrow-right" [size]="16" /></p>
      </div>
    </article>
  `,
  styles: `
    :host {
      display: block;
    }
    .pcard {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 0;
      overflow: hidden;
      transition:
        transform var(--transition),
        box-shadow var(--transition),
        border-color var(--transition);
    }
    .pcard:hover,
    .pcard:focus-within {
      border-color: var(--primary);
      box-shadow: var(--shadow-lg);
    }
    .pcard__media {
      display: grid;
      place-items: center;
      aspect-ratio: 16 / 9;
      padding: var(--sp-5);
      background: #f1f5f9;
      border-bottom: 1px solid var(--border);
    }
    .pcard__media img {
      max-height: 100%;
      width: auto;
      object-fit: contain;
    }
    .pcard__body {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: var(--sp-3);
      padding: var(--sp-5);
    }
    .pcard__title {
      font-size: var(--fs-lg);
    }
    .pcard__link {
      color: var(--text);
      text-decoration: none;
    }
    .pcard__link::after {
      content: '';
      position: absolute;
      inset: 0;
    }
    .pcard__summary {
      font-size: var(--fs-sm);
    }
    .pcard__more {
      display: inline-flex;
      align-items: center;
      gap: var(--sp-1);
      margin-top: auto;
      color: var(--primary);
      font-weight: 600;
      font-size: var(--fs-sm);
    }
    @media (prefers-reduced-motion: no-preference) {
      .pcard:hover {
        transform: translateY(-3px);
      }
    }
  `,
})
export class ProjectCardComponent {
  readonly project = input.required<Project>();
  protected readonly maxChips = 5;
}
