import { Component, Input } from '@angular/core';
import { SOCIAL_LINKS, STARTING_YEAR } from '../../../data';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [
    RouterLink
  ],
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  @Input() title!: string;

  startingYear = STARTING_YEAR;
  year = new Date().getFullYear();
  linkedInUrl = SOCIAL_LINKS.linkedIn;
  githubUrl = SOCIAL_LINKS.github;

  activeLink = 'accueil';

  setActiveLink(link: string, event: Event): void {
    event.preventDefault();
    this.activeLink = link;
  }
}
