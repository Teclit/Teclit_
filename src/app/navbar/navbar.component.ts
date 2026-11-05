import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ScrollSpyService } from '../core/scroll-spy.service';
import { ThemeService } from '../core/theme.service';
import { IconComponent } from '../shared/icon/icon.component';
import { ButtonComponent } from '../shared/ui/button.component';

export interface NavLink {
  label: string;
  fragment: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { label: 'À propos', fragment: 'a-propos' },
  { label: 'Parcours', fragment: 'parcours' },
  { label: 'Compétences', fragment: 'competences' },
  { label: 'Projets', fragment: 'projets' },
  { label: 'Formation', fragment: 'formation' },
  { label: 'Contact', fragment: 'contact' },
];

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, IconComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sticky top-0 z-50 block border-b border-border/70 bg-bg/80 backdrop-blur-lg print:hidden',
    '(document:keydown.escape)': 'closeMenu()',
  },
  template: `
    <header class="container-page flex h-header items-center justify-between gap-4">
      <a
        routerLink="/"
        class="rounded-md text-2xl font-extrabold tracking-tight text-fg no-underline"
        (click)="closeMenu()"
        >Te<span class="text-accent">.</span><span class="sr-only"> Teklit TEWOLDE, accueil</span></a
      >

      <nav aria-label="Navigation principale" class="contents">
        <ul
          id="menu-principal"
          role="list"
          class="absolute inset-x-0 top-full flex-col gap-1 border-b border-border bg-bg p-4 shadow-lift md:static md:flex md:flex-row md:items-center md:gap-1 md:border-0 md:bg-transparent md:p-0 md:shadow-none"
          [class]="menuOpen() ? 'flex' : 'hidden'"
        >
          @for (link of links; track link.fragment) {
            @let active = spy.activeId() === link.fragment;
            <li>
              <a
                routerLink="/"
                [fragment]="link.fragment"
                class="relative block rounded-full px-3 py-2 text-sm font-medium no-underline hover:text-accent"
                [class]="active ? 'bg-accent-soft text-accent-strong dark:text-accent' : 'text-muted'"
                [attr.aria-current]="active ? 'location' : null"
                (click)="closeMenu()"
                >{{ link.label }}</a
              >
            </li>
          }
          <li class="md:ml-2">
            <a appButton size="sm" routerLink="/cv" routerLinkActive ariaCurrentWhenActive="page" (click)="closeMenu()">
              <app-icon name="download" [size]="16" /> CV
            </a>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-2">
        <button
          appButton
          variant="secondary"
          size="icon"
          type="button"
          data-testid="theme-toggle"
          [attr.aria-pressed]="theme.theme() === 'dark'"
          (click)="theme.toggle()"
        >
          <span class="sr-only">Thème sombre</span>
          <app-icon [name]="theme.theme() === 'dark' ? 'sun' : 'moon'" />
        </button>
        <button
          appButton
          variant="secondary"
          size="icon"
          type="button"
          class="md:hidden"
          data-testid="menu-toggle"
          aria-controls="menu-principal"
          [attr.aria-expanded]="menuOpen()"
          (click)="menuOpen.set(!menuOpen())"
        >
          <span class="sr-only">Menu</span>
          <app-icon [name]="menuOpen() ? 'close' : 'menu'" />
        </button>
      </div>
    </header>
  `,
})
export class NavbarComponent {
  protected readonly theme = inject(ThemeService);
  protected readonly spy = inject(ScrollSpyService);
  protected readonly links = NAV_LINKS;
  readonly menuOpen = signal(false);

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
