import { Component } from '@angular/core';

@Component({
  selector: 'app-apropos',
  imports: [],
  templateUrl: './apropos.component.html',
  styleUrl: './apropos.component.css'
})

export class AproposComponent {
  imageUrl = 'assets/images/profile.png';
  description = `
    Ingénieur logiciel junior spécialisé en développement Full Stack, avec une expertise en Java, Kotlin et architectures micro-services.
    Expérimenté en conception de solutions innovantes, intégration de services cloud et mise en œuvre de pipelines CI/CD.
    Passionné par les systèmes évolutifs et l’ingénierie logicielle, je vise à devenir expert en contribuant à des projets ambitieux
    et en adoptant les meilleures pratiques Agile et DevOps pour garantir performance et fiabilité.
  `;
}
