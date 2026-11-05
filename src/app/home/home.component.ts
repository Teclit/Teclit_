import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROFILE } from '../data/profile.data';
import { IconComponent } from '../shared/icon/icon.component';

/** Section « Hero » : accroche et appels à l'action. */
@Component({
  selector: 'app-home',
  imports: [RouterLink, IconComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly identity = PROFILE.identity;
  protected readonly highlights = ['Java', 'Kotlin', 'Spring Boot', 'Node.js', 'NestJS', 'React', 'Next.js', 'Docker'];
}
