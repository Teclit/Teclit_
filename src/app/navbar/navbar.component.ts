import { Component, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() title!: string;
  activeLink: string = 'Accueil';
  menuOpen = false;

  setActiveLink(link: string, event: Event): void {
    event.preventDefault();
    this.activeLink = link;

    // Close the menu after clicking a link (for mobile view)
    if (window.innerWidth <= 730) {
      this.menuOpen = false;
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    // Automatically close the menu on resizing to a larger screen
    if (window.innerWidth > 730) {
      this.menuOpen = false;
    }
  }
}
