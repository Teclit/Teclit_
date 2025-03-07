import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-competences',
  imports: [CommonModule],
  templateUrl: './competences.component.html',
  styleUrls: ['./competences.component.css'],
  standalone: true
})
export class CompetencesComponent {
  competences = [
    {
      icon: 'code',
      title: 'Développement Frontend',
      description: "Expertise dans la création d'interfaces utilisateur dynamiques et performantes. Maîtrise des frameworks " +
        "modernes pour développer des applications web responsive, interactives et optimisées pour l'expérience utilisateur." +
        " Spécialisation dans les Single Page Applications (SPA) et les Progressive Web Apps (PWA).",
      technologies: ['React.js', 'Angular', 'Bootstrap', 'JavaScript', 'TypeScript'],
    },
    {
      icon: 'database',
      title: 'Développement Backend',
      description: "Conception et développement d'architectures backend robustes et évolutives. Expertise dans la création " +
        "d'APIs RESTful hautement performantes, la gestion efficace des bases de données et l'implémentation de microservices. " +
        "Focus sur la scalabilité et la maintenabilité du code.",
      technologies: ['Java', 'Kotlin', 'Spring Boot', 'Node.js', 'Python'],
    },
    {
      icon: 'cloud',
      title: 'Cloud & Orchestration',
      description: "Expertise dans le déploiement et la gestion d'infrastructures cloud natives. Configuration de clusters " +
        "Kubernetes pour l'orchestration de conteneurs, mise en place de solutions de stockage distribuées et implémentation " +
        "de services managés cloud pour une scalabilité optimale.",
      technologies: ['AWS', 'Kubernetes', 'Docker', 'MongoDB Atlas'],
    },
    {
      icon: 'cogs',
      title: 'CI/CD & DevOps',
      description: "Mise en place de pipelines d'intégration et de déploiement continus sophistiqués. Automatisation complète " +
        "du cycle de vie des applications, de la validation du code à la livraison en production. Expertise en Infrastructure as Code (IaC) et monitoring avancé.",
      technologies: ['Jenkins', 'GitLab CI', 'GitHub Actions', 'Docker'],
    },
    {
      icon: 'shield-alt',
      title: 'Sécurité & Qualité',
      description: "Implémentation de mesures de sécurité robustes et de pratiques de qualité logicielle. " +
        "Expertise en authentification OAuth2/JWT, tests automatisés (unitaires, intégration, E2E), " +
        "analyse statique du code et conformité aux standards OWASP.",
      technologies: ['JWT', 'Spring Security', 'JUnit', 'Mockito', 'Quodana'],
    },
    {
      icon: 'project-diagram',
      title: 'Architecture & Modélisation',
      description: "Conception d'architectures logicielles évolutives et maintenables. Expertise en patterns de conception, " +
        "architecture hexagonale, et systèmes distribués. Maîtrise des principes SOLID et DDD " +
        "pour des solutions durables et adaptables aux changements.",
      technologies: ['UML', 'Microservices', 'REST API', 'CQRS', 'Event-driven Architecture'],
    }
  ];
}
