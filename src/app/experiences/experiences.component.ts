import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-experiences',
  imports: [CommonModule],
  templateUrl: './experiences.component.html',
  styleUrls: ['./experiences.component.css']
})
export class ExperiencesComponent {
  experiences = [
    {
      title: "Développeur Full Stack",
      description: "Développement et optimisation de solutions web et mobiles pour une agence web-marketing en pleine croissance. Conception d’interfaces utilisateur modernes en React.js et Next.js, intégration d’API et gestion des bases de données relationnelles et non relationnelles. Participation aux phases de spécifications techniques, développement, tests et maintenance évolutive.",
      location: "TXStudio, Asnières-sur-Seine",
      link: "#"
    },
    {
      title: 'Développeur Full Stack Java',
      description: 'Développement d’un assistant virtuel et d’interfaces utilisateur modernes en React.js.',
      location: 'SNCF Connect & Tech, Puteaux',
      link: '#'
    },
    {
      title: 'Développeur Backend Java',
      description: 'Développement et maintenance d’API REST sécurisées avec Spring Boot 3 et MySQL.',
      location: 'Projet École, Nanterre',
      link: '#'
    },
    {
      title: 'Développeur d\'application web (Stage)',
      description: 'Développement d’applications web avec PHP, Bootstrap et MySQL.',
      location: 'Dgicotek, Émerainville',
      link: '#'
    },
    {
      title: 'Développeur Web et Web Mobile (Stage)',
      description: 'Création d’un site vitrine et gestion d’une base de données sécurisée.',
      location: 'Le Klub, Hérouville-Saint-Clair',
      link: '#'
    },
    {
      title: 'Développeur Web (Stage)',
      description: 'Développement d’un blog avec Laravel et MySQL, incluant une authentification sécurisée.',
      location: 'WEBBEL, Caen',
      link: '#'
    },
    {
      title: 'Développeur Web (Stage)',
      description: "Développement d'un site web statique avec HTML, CSS et JavaScript vanilla, incluant des animations interactives et un design responsive.",
      location: 'NetConception, Caen',
      link: '#'
    }
  ];
}
