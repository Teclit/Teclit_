import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROFILE } from '../data/profile.data';
import { IconComponent } from '../shared/icon/icon.component';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-competences',
  imports: [IconComponent, RevealDirective],
  templateUrl: './competences.component.html',
  styleUrl: './competences.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompetencesComponent {
  protected readonly groups = PROFILE.skillGroups;
  protected readonly logos = PROFILE.techLogos;
}
