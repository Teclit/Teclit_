import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROFILE } from '../data/profile.data';
import { NAV_LINKS } from '../navbar/navbar.component';
import { IconComponent } from '../shared/icon/icon.component';

/** Année de début d'activité affichée dans le copyright (reprise du site existant). */
export const STARTING_YEAR = 2019;

@Component({
  selector: 'app-footer',
  imports: [RouterLink, IconComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected readonly identity = PROFILE.identity;
  protected readonly links = NAV_LINKS;
  protected readonly startingYear = STARTING_YEAR;
  protected readonly year = new Date().getFullYear();
}
