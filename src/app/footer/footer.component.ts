import {Component, Input} from '@angular/core';

interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

@Component({
  selector: 'app-footer',
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


  contactInfo: ContactInfo = {
    email: 'Email',
    phone: "000000",
    address: "10 rue de paris "
  };

}
