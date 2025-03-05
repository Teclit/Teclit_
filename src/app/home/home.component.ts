import { Component } from '@angular/core';
import {SOCIAL_LINKS} from '../../../data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  cvdesignrUrl: string = SOCIAL_LINKS.cvdesignr;
  linkedInUrl: string = SOCIAL_LINKS.linkedIn;

}
