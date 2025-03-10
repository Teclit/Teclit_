import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  link?: string;
}


@Component({
  selector: 'app-realisation',
  imports: [CommonModule],
  templateUrl: './realisation.component.html',
  styleUrl: './realisation.component.css'
})


export class RealisationComponent {
  projects: Project[] = [
    {
      title: "QCMPLUS",
      description: "QCMPLUS est une plateforme complète conçue pour gérer efficacement les quiz et les questionnaires. " +
        "La structure du projet comprend divers composants pour les contrôleurs, les modèles, les dépôts et les services, permettant une architecture robuste et évolutive.",
      technologies: [  "Java 17", "Spring Boot 3", "Spring Security", "MySQL", "JWT", "JUnit", "Mockito", "Docker", "GitHub Actions", "CI/CD", "Quodana"],
      image: "assets/qcmplus.png",
      link: "https://qcmplus.vercel.app/"
    },
    {
      title: "Bot TGV INOUI",
      description: "Développement d'un chatbot pour fournir des informations en temps réel aux voyageurs.",
      technologies: ["React, Java", "Kotlin", "Spring Boot", "MongoDB", "Tock", "AWS"],
      image: "assets/chatbot-inoui.png",
      link: "https://bot.tgvinoui.sncf/"
    },
    {
      title: "Chatbot SNCF Transilien",
      description: "Développement d'un chatbot pour fournir des informations en temps réel aux voyageurs.",
      technologies: ["React, Java", "Kotlin", "Spring Boot", "MongoDB", "Tock", "AWS"],
      image: "assets/chatbot-tilien.png",
      link: "https://www.transilien.com/en/page-medias/le-chatbot-transilien"
    },
    {
      title: "Assistant Virtuel - SNCF",
      description: "Développement d'un chatbot pour fournir des informations en temps réel aux voyageurs.",
      technologies: ["React, Java", "Kotlin", "Spring Boot", "MongoDB", "Tock", "AWS"],
      image: "assets/chatbot-sncf-voyageur.png",
      link: "https://bot.assistant.sncf/index.html"
    },
    {
      title: "Gestion Parking & QR Generator",
      description: "Conception d'une interface web pour générer et gérer des QR codes dynamiques.",
      technologies: [ "jQuery", "Bootstrap", "PHP", "SQL", "MySQL", "Chart.JS"],
      image: "assets/les-rives-droite.png",
      link: "http://rivesqr.web-interactive.fr/"
    },
    {
      title: "Site Vitrine",
      description: "Développement d'un site web moderne pour présenter des services professionnels.",
      technologies: ["WordPress", "HTML", "CSS", "JS", "PHP" ],
      image: "assets/la-petite-boutique-de-fleurs.png",
      link: "http://www.la-petite-boutique-de-fleurs.fr/"
    }
  ];
}
