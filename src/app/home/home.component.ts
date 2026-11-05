import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content/content.service';
import { IconComponent } from '../shared/icon/icon.component';
import { ButtonComponent } from '../shared/ui/button.component';
import { TagComponent } from '../shared/ui/tag.component';
import { TypedTextComponent } from '../shared/ui/typed-text.component';

/** Hero : fond en dégradés doux animés (transform), intitulé « tapé », appels à l'action. */
@Component({
  selector: 'app-home',
  imports: [RouterLink, NgOptimizedImage, IconComponent, ButtonComponent, TagComponent, TypedTextComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <section id="accueil" aria-labelledby="hero-title" class="relative isolate overflow-hidden">
      <!-- Fond : dégradés de la couleur d'accent, animés uniquement en transform -->
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
        <div
          class="absolute -top-48 left-[-10%] size-[38rem] rounded-full bg-accent/25 blur-3xl will-change-transform motion-safe:animate-drift dark:bg-accent/15"
        ></div>
        <div
          class="absolute -bottom-56 right-[-15%] size-[34rem] rounded-full bg-accent/15 blur-3xl will-change-transform motion-safe:animate-drift-slow dark:bg-accent/10"
        ></div>
        <div
          class="absolute inset-0 bg-[radial-gradient(color-mix(in_oklab,var(--fg)_9%,transparent)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)] bg-size-[22px_22px]"
        ></div>
      </div>

      <div
        class="container-page grid items-center gap-12 py-16 sm:py-24 lg:min-h-[calc(100svh-var(--spacing-header))] lg:grid-cols-[1.35fr_1fr]"
      >
        <div>
          <p
            class="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-sm font-medium text-muted backdrop-blur"
          >
            <span class="relative flex size-2.5" aria-hidden="true">
              <span
                class="absolute inline-flex size-full rounded-full bg-success opacity-60 motion-safe:animate-ping"
              ></span>
              <span class="relative inline-flex size-2.5 rounded-full bg-success"></span>
            </span>
            {{ identity.availability }} · {{ identity.location }}
          </p>

          <h1 id="hero-title" class="mt-6 text-display font-extrabold text-fg">
            {{ identity.fullName }}
            <span class="mt-3 block min-h-[1.2em] text-[0.55em] leading-tight tracking-tight text-accent">
              <app-typed-text [words]="identity.roles" />
            </span>
          </h1>

          <p class="mt-6 max-w-xl text-lg text-muted sm:text-xl">{{ identity.tagline }}</p>

          <div class="mt-8 flex flex-wrap gap-3">
            <a appButton routerLink="/" fragment="projets">
              Voir les projets <app-icon name="arrow-right" [size]="18" />
            </a>
            <a appButton variant="secondary" routerLink="/cv">
              <app-icon name="download" [size]="18" /> Télécharger le CV
            </a>
            <a appButton variant="ghost" routerLink="/" fragment="contact">
              <app-icon name="mail" [size]="18" /> Me contacter
            </a>
          </div>

          <ul role="list" aria-label="Technologies principales" class="mt-10 flex flex-wrap gap-2">
            @for (tech of identity.highlights; track tech) {
              <li>
                <app-tag variant="outline">{{ tech }}</app-tag>
              </li>
            }
          </ul>
        </div>

        <div class="relative mx-auto w-full max-w-64 sm:max-w-80 lg:max-w-md">
          <div
            aria-hidden="true"
            class="absolute -inset-4 rounded-full bg-linear-to-br from-accent/50 via-accent/10 to-transparent blur-2xl"
          ></div>
          <img
            class="relative aspect-square w-full rounded-full object-cover shadow-lift ring-4 ring-surface"
            [ngSrc]="identity.photo.src"
            ngSrcset="320w, 640w"
            sizes="(min-width: 1024px) 448px, (min-width: 640px) 320px, 256px"
            [width]="identity.photo.width"
            [height]="identity.photo.height"
            [alt]="identity.photo.alt"
            priority
          />
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent {
  protected readonly identity = inject(ContentService).identity;
}
