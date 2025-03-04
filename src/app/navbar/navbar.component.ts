import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() title!: string;
  activeLink: string = 'Accueil';

  setActiveLink(link: string, event: Event): void {
    event.preventDefault();
    this.activeLink = link;
    this.menuOpen = false;
  }

  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }


}
