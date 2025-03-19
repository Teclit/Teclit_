import { Component, Input, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [
    RouterLink
  ],
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() title!: string;
  activeLink = 'accueil';
  menuOpen = false;

  setActiveLink(link: string, event: Event): void {
    event.preventDefault();
    this.activeLink = link;

    if (window.innerWidth <= 730) {
      this.menuOpen = false;
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 730) {
      this.menuOpen = false;
    }
  }
}
