import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROFILE } from '../data/profile.data';
import { IconComponent } from '../shared/icon/icon.component';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-apropos',
  imports: [IconComponent, RevealDirective],
  templateUrl: './apropos.component.html',
  styleUrl: './apropos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AproposComponent {
  protected readonly identity = PROFILE.identity;
  protected readonly languages = PROFILE.languages;
  protected readonly facts = [
    { label: 'Expérience', value: 'Plus de 3 ans' },
    { label: 'Équipe max.', value: '10 développeurs' },
    { label: 'Formation', value: 'Bac+5 — Niveau 7' },
  ];
}
