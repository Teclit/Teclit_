import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../core/theme.service';
import { PROFILE } from '../data/profile.data';
import { IconComponent } from '../shared/icon/icon.component';

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
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  protected readonly theme = inject(ThemeService);
  protected readonly brand = PROFILE.identity.brand;
  protected readonly links = NAV_LINKS;
  readonly menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }
}
