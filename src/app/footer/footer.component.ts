import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content/content.service';
import { NAV_LINKS } from '../navbar/navbar.component';
import { IconComponent } from '../shared/icon/icon.component';
import { ButtonComponent } from '../shared/ui/button.component';

/** Année de début d'activité affichée dans le copyright. */
export const STARTING_YEAR = 2019;

@Component({
  selector: 'app-footer',
  imports: [RouterLink, IconComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block border-t border-border bg-surface print:hidden' },
  template: `
    <footer class="container-page grid gap-8 py-12 md:grid-cols-[1.2fr_2fr_auto] md:items-start">
      <div>
        <p class="text-2xl font-extrabold tracking-tight">Te<span class="text-accent">.</span></p>
        <p class="mt-2 font-semibold">{{ identity.fullName }}</p>
        <p class="text-sm text-muted">Développeur Full Stack · {{ identity.location }}</p>
      </div>

      <nav aria-label="Navigation de pied de page">
        <ul role="list" class="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
          @for (link of links; track link.fragment) {
            <li>
              <a routerLink="/" [fragment]="link.fragment" class="text-muted no-underline hover:text-accent">{{
                link.label
              }}</a>
            </li>
          }
          <li><a routerLink="/cv" class="text-muted no-underline hover:text-accent">CV</a></li>
        </ul>
      </nav>

      <ul role="list" class="flex gap-2">
        <li>
          <a
            appButton
            variant="secondary"
            size="icon"
            [href]="identity.links.github"
            target="_blank"
            rel="noopener noreferrer"
          >
            <app-icon name="github" /><span class="sr-only">GitHub (nouvel onglet)</span>
          </a>
        </li>
        <li>
          <a
            appButton
            variant="secondary"
            size="icon"
            [href]="identity.links.linkedin"
            target="_blank"
            rel="noopener noreferrer"
          >
            <app-icon name="linkedin" /><span class="sr-only">LinkedIn (nouvel onglet)</span>
          </a>
        </li>
        <li>
          <a appButton variant="secondary" size="icon" [href]="'mailto:' + identity.links.email">
            <app-icon name="mail" /><span class="sr-only">Envoyer un email</span>
          </a>
        </li>
      </ul>

      <p class="text-sm text-muted md:col-span-3">&copy; {{ startingYear }} – {{ year }} {{ identity.fullName }}</p>
    </footer>
  `,
})
export class FooterComponent {
  protected readonly identity = inject(ContentService).identity;
  protected readonly links = NAV_LINKS;
  protected readonly startingYear = STARTING_YEAR;
  protected readonly year = new Date().getFullYear();
}
