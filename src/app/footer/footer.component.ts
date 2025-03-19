import { Component, Input } from '@angular/core';
import { SOCIAL_LINKS } from '../../../data';
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

  startingYear = 2019; // Suppression ": number"
  year = new Date().getFullYear(); // ": number" évident
  linkedInUrl = SOCIAL_LINKS.linkedIn; // ": string" évident
  githubUrl = SOCIAL_LINKS.github; // ": string" évident

  activeLink = 'accueil'; // ": string" évident

  setActiveLink(link: string, event: Event): void {
    event.preventDefault();
    this.activeLink = link;
  }
}
