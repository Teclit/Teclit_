import {Component, Input} from '@angular/core';
import {CardComponent} from '../card/card.component';

// Déplacer les interfaces et constantes dans un fichier séparé
interface CarouselImage {
  url: string;
  alt: string;
}

interface CarouselConfig {
  readonly imagesPerView: number;
  readonly logoDirectory: string;
}

const CAROUSEL_CONFIG: CarouselConfig = {
  imagesPerView: 4,
  logoDirectory: 'assets/logos/'
};

const SUPPORTED_LANGUAGES: CarouselImage[] = [
  { url: `${CAROUSEL_CONFIG.logoDirectory}node.png`, alt: 'Node.js logo' },
  { url: `${CAROUSEL_CONFIG.logoDirectory}java.png`, alt: 'Java logo' },
  { url: `${CAROUSEL_CONFIG.logoDirectory}JavaScript.png`, alt: 'JavaScript logo' },
  { url: `${CAROUSEL_CONFIG.logoDirectory}python.png`, alt: 'Python logo' },
  { url: `${CAROUSEL_CONFIG.logoDirectory}csharp.png`, alt: 'C# logo' },
  { url: `${CAROUSEL_CONFIG.logoDirectory}ruby.png`, alt: 'Ruby logo' },
  { url: `${CAROUSEL_CONFIG.logoDirectory}go.png`, alt: 'go logo' },
  { url: `${CAROUSEL_CONFIG.logoDirectory}php.png`, alt: 'PHP logo' },
  { url: `${CAROUSEL_CONFIG.logoDirectory}scala.png`, alt: 'Scala logo' },
  { url: `${CAROUSEL_CONFIG.logoDirectory}clojure.png`, alt: 'Clojure logo' }
];

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})
export class SkillsComponent {
  @Input() images: CarouselImage[] = SUPPORTED_LANGUAGES;
  @Input() config: CarouselConfig = CAROUSEL_CONFIG;

}
