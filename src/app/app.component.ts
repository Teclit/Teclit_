import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { COMPANY_NAME } from '../../data';
import {SkillsComponent} from './skills/skills.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    RouterModule,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    SkillsComponent
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  @Input() titleInput!: string;
  title = COMPANY_NAME;
  activeLink = 'accueil';

  setActiveLink(section: string, event: Event) {
    event.preventDefault();
    this.activeLink = section;
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
