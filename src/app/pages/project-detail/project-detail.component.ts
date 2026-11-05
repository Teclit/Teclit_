import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content/content.service';
import { SeoService } from '../../core/seo.service';
import { HasContentPipe, WithContentPipe } from '../../shared/content.pipe';
import { IconComponent } from '../../shared/icon/icon.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { CardComponent } from '../../shared/ui/card.component';
import { TagComponent } from '../../shared/ui/tag.component';
import { NotFoundComponent } from '../not-found/not-found.component';

@Component({
  selector: 'app-project-detail',
  imports: [
    RouterLink,
    NgOptimizedImage,
    IconComponent,
    ButtonComponent,
    CardComponent,
    TagComponent,
    HasContentPipe,
    WithContentPipe,
    NotFoundComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (project(); as p) {
      <article class="container-page py-12 sm:py-16">
        <nav aria-label="Fil d'Ariane" class="text-sm text-muted">
          <ol role="list" class="flex flex-wrap items-center gap-2">
            <li><a routerLink="/" class="hover:text-accent">Accueil</a></li>
            <li aria-hidden="true">/</li>
            <li><a routerLink="/" fragment="projets" class="hover:text-accent">Projets</a></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" class="font-medium text-fg">{{ p.title }}</li>
          </ol>
        </nav>

        <header class="mt-8 grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-accent">Projet</p>
            <h1 class="mt-3 text-h2 font-extrabold">{{ p.title }}</h1>
            <p class="mt-4 text-lg text-muted">{{ p.summary }}</p>
            @if (experience(); as exp) {
              <p class="mt-4 text-sm">
                Contexte : <strong>{{ exp.company }}</strong> — {{ exp.role }} ({{ exp.period }})
              </p>
            }
            <div class="mt-6 flex flex-wrap gap-3">
              @if (p.link) {
                <a appButton [href]="p.link" target="_blank" rel="noopener noreferrer">
                  Voir le projet <app-icon name="external" [size]="16" /><span class="sr-only">(nouvel onglet)</span>
                </a>
              }
              @if (p.repository) {
                <a appButton variant="secondary" [href]="p.repository" target="_blank" rel="noopener noreferrer">
                  <app-icon name="github" [size]="16" /> Code source<span class="sr-only">(nouvel onglet)</span>
                </a>
              }
            </div>
          </div>
          <div
            class="grid aspect-[4/3] place-items-center rounded-card border border-border bg-linear-to-br from-accent-soft via-surface to-surface-2 p-8 shadow-card"
          >
            <img
              [ngSrc]="p.image.src"
              [width]="p.image.width"
              [height]="p.image.height"
              [alt]="p.image.alt"
              class="max-h-full w-auto rounded-lg object-contain"
              priority
            />
          </div>
        </header>

        <div class="mt-12 grid gap-5 md:grid-cols-2">
          @if (p.problem | hasContent) {
            <section appCard aria-labelledby="d-problem">
              <h2 id="d-problem" class="text-h3 font-bold">Problème</h2>
              <p class="mt-2 text-muted">{{ p.problem }}</p>
            </section>
          }
          @if (p.solution | hasContent) {
            <section appCard aria-labelledby="d-solution">
              <h2 id="d-solution" class="text-h3 font-bold">Solution</h2>
              <p class="mt-2 text-muted">{{ p.solution }}</p>
            </section>
          }
          @let architecture = p.architecture | withContent;
          @if (architecture.length) {
            <section appCard aria-labelledby="d-archi">
              <h2 id="d-archi" class="text-h3 font-bold">Architecture</h2>
              <ul class="mt-2 list-disc space-y-1.5 pl-5 text-muted marker:text-accent">
                @for (item of architecture; track $index) {
                  <li>{{ item }}</li>
                }
              </ul>
            </section>
          }
          <section appCard aria-labelledby="d-stack">
            <h2 id="d-stack" class="text-h3 font-bold">Stack technique</h2>
            <ul role="list" class="mt-3 flex flex-wrap gap-1.5">
              @for (tech of p.stack; track tech) {
                <li>
                  <app-tag variant="accent">{{ tech }}</app-tag>
                </li>
              }
            </ul>
          </section>
        </div>

        @let nav = siblings();
        @if (nav) {
          <nav
            aria-label="Autres projets"
            class="mt-12 flex flex-wrap justify-between gap-3 border-t border-border pt-8"
          >
            <a appButton variant="secondary" [routerLink]="['/projets', nav.previous.slug]">
              <app-icon name="arrow-left" [size]="16" /> {{ nav.previous.title }}
            </a>
            <a appButton variant="secondary" [routerLink]="['/projets', nav.next.slug]">
              {{ nav.next.title }} <app-icon name="arrow-right" [size]="16" />
            </a>
          </nav>
        }
      </article>
    } @else {
      <app-not-found />
    }
  `,
})
export class ProjectDetailComponent {
  private readonly content = inject(ContentService);
  private readonly seo = inject(SeoService);

  /** Paramètre de route `:slug` (lié via `withComponentInputBinding`). */
  readonly slug = input<string>();

  readonly project = computed(() => this.content.project(this.slug()));
  readonly experience = computed(() => this.content.experience(this.project()?.experienceId));
  readonly siblings = computed(() => {
    const current = this.project();
    const list = this.content.projects;
    if (!current || list.length < 2) return null;
    const i = list.indexOf(current);
    return { previous: list[(i - 1 + list.length) % list.length], next: list[(i + 1) % list.length] };
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
