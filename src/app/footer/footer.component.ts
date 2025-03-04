import {Component, Input} from '@angular/core';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';


interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

@Component({
  selector: 'app-footer',
  imports: [
    FaIconComponent
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  @Input() title!: string;
  startingYear: number = 2019;
  year: number = new Date().getFullYear();

  activeLink: string = 'Accueil';

  setActiveLink(link: string): void {
    this.activeLink = link;
  }

  socialLinks = [
    {url: '#', iconClass: 'fab fa-github'},
    {url: '#', iconClass: 'fab fa-facebook'},
    {url: '#', iconClass: 'fab fa-instagram'},
    {url: '#', iconClass: 'fab fa-twitter'}
  ];

  contactInfo: ContactInfo = {
    email: 'Email',
    phone: "000000",
    address: "10 rue de paris "
  };

}
