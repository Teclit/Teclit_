import {NavbarComponent} from './navbar/navbar.component';
import {HomeComponent} from './home/home.component';
import {FooterComponent} from './footer/footer.component';
import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    NavbarComponent,
    HomeComponent,
    FooterComponent
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {

  @Input() titleInput!: string;
  title = 'Teklit Te.';

}
