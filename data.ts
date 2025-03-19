// Définition d'un type explicite pour les liens de profil
type SocialLinks = {
  linkedIn: string;
  github: string;
  cvdesignr: string;
};

// Add this with the other constants
const STARTING_YEAR = 2019;

const COMPANY_NAME = 'Teklit Te...';
const SOCIAL_LINKS: SocialLinks = {
  linkedIn: 'https://www.linkedin.com/in/teklittewolde/',
  github: 'https://github.com/Teclit',
  cvdesignr: 'https://cvdesignr.com/p/5ca9b929ed8c4'
};

// Exportation centralisée pour faciliter l'importation ailleurs
export {COMPANY_NAME, SOCIAL_LINKS, STARTING_YEAR};


// data.ts
export interface SkillImage {
  name: string;
  url: string;
  alt: string;
}

const imgDirectory: string = "assets/logos/";

// List of skill images
export const SKILL_IMAGES: SkillImage[] = [
  // Frontend Technologies
  {name: 'Angular', url: `${imgDirectory}angular.png`, alt: 'Angular Logo'},
  {name: 'React', url: `${imgDirectory}react.png`, alt: 'React Logo'},
  {name: 'Vue.js', url: `${imgDirectory}vue.png`, alt: 'Vue.js Logo'},
  {name: 'Jquery ', url: `${imgDirectory}jquery.png`, alt: 'Jquery  Logo'},
  {name: 'TypeScript', url: `${imgDirectory}typescript.png`, alt: 'TypeScript Logo'},
  {name: 'JavaScript', url: `${imgDirectory}JavaScript.png`, alt: 'JavaScript Logo'},
  {name: 'HTML', url: `${imgDirectory}html.png`, alt: 'HTML Logo'},
  {name: 'CSS', url: `${imgDirectory}css.png`, alt: 'CSS Logo'},
  {name: 'Bootstrap', url: `${imgDirectory}bootstrap.png`, alt: 'Bootstrap Logo'},
  {name: 'Tailwind CSS', url: `${imgDirectory}tailwind.png`, alt: 'Tailwind CSS Logo'},
  {name: 'Webpack', url: `${imgDirectory}webpack.png`, alt: 'Webpack Logo'},

  // Backend Technologies
  {name: 'Java', url: `${imgDirectory}java.png`, alt: 'Java Logo'},
  {name: 'Kotlin', url: `${imgDirectory}kotlin.png`, alt: 'Kotlin Logo'},
  {name: 'SQL', url: `${imgDirectory}sql.png`, alt: 'SQL Logo'},
  {name: 'PHP', url: `${imgDirectory}php.png`, alt: 'PHP Logo'},
  {name: 'Python', url: `${imgDirectory}python.png`, alt: 'Python Logo'},
  {name: 'C#', url: `${imgDirectory}csharp.png`, alt: 'C# Logo'},
  {name: 'Node.js', url: `${imgDirectory}nodejs.png`, alt: 'Node.js Logo'},
  {name: 'Express.js', url: `${imgDirectory}express.png`, alt: 'Express.js Logo'},
  {name: 'Spring Boot', url: `${imgDirectory}spring-boot.png`, alt: 'Spring Boot Logo'},
  {name: 'Laravel', url: `${imgDirectory}laraval.png`, alt: 'Laravel Logo'},
  {name: 'Symfony', url: `${imgDirectory}symfony.png`, alt: 'Symfony Logo'},
  {name: 'Tomcat', url: `${imgDirectory}tomcat.png`, alt: 'Tomcat Logo'},

  // Version Control, CI/CD, DevOps & Cloud
  {name: 'Git', url: `${imgDirectory}git.png`, alt: 'Git Logo'},
  {name: 'GitHub', url: `${imgDirectory}github.png`, alt: 'GitHub Logo'},
  {name: 'GitLab', url: `${imgDirectory}gitlab.png`, alt: 'GitLab Logo'},
  {name: 'Docker', url: `${imgDirectory}docker.png`, alt: 'Docker Logo'},
  {name: 'AWS', url: `${imgDirectory}aws.png`, alt: 'AWS Logo'},
  {name: 'Kubernetes', url: `${imgDirectory}kubernetes.png`, alt: 'Kubernetes Logo'},
  {name: 'Jenkins', url: `${imgDirectory}jenkins.png`, alt: 'Jenkins Logo'},
  {name: 'Nginx', url: `${imgDirectory}nginx.png`, alt: 'Nginx Logo'},


  // Databases
  {name: 'MySQL', url: `${imgDirectory}mysql.png`, alt: 'MySQL Logo'},
  {name: 'MongoDB', url: `${imgDirectory}mongodb.png`, alt: 'MongoDB Logo'},
  {name: 'PostgreSQL', url: `${imgDirectory}postgresql.png`, alt: 'PostgreSQL Logo'},
  {name: 'Oracle', url: `${imgDirectory}oracle.png`, alt: 'Oracle Logo'},

  // Tools & Utilities
  {name: 'Figma', url: `${imgDirectory}figma.png`, alt: 'Figma Logo'},
  {name: 'JIRA', url: `${imgDirectory}jira.png`, alt: 'JIRA Logo'},
  {name: 'JUnit', url: `${imgDirectory}Junit.png`, alt: 'JUnit Logo'},
  {name: 'JSON', url: `${imgDirectory}json.png`, alt: 'JSON Logo'},
  {name: 'Next.js', url: `${imgDirectory}nextjs.png`, alt: 'Next.js Logo'},
  {name: 'NPM', url: `${imgDirectory}npm.png`, alt: 'NPM Logo'},
  {name: 'Rest API', url: `${imgDirectory}restapi.png`, alt: 'Rest API Logo'},
  {name: 'Tock', url: `${imgDirectory}tock.png`, alt: 'Tock Logo'},

];


// Interface pour les compétences
export interface Competence {
  icon: string;
  title: string;
  description: string;
  technologies: string[];
}

// Liste des compétences
export const COMPETENCES: Competence[] = [
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


//Mes Realisations
export interface Project {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  link?: string;
}

export const PROJECTS: Project[] = [
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
    technologies: ["Java 11+", "Kotlin", "Reactjs", "MongoDB","Nginx", "Kubernetes", "AWS", "Git", "GitLab", "NLP", "Jenkins", "Tock", "API REST", "JIRA"],
    image: "assets/chatbot-inoui.png",
    link: "https://bot.tgvinoui.sncf/"
  },
  {
    title: "Chatbot SNCF Transilien",
    description: "Développement d'un chatbot pour fournir des informations en temps réel aux voyageurs.",
    technologies: ["Java 11+", "Kotlin", "Reactjs", "MongoDB","Nginx", "Kubernetes", "AWS", "Git", "GitLab", "NLP", "Jenkins", "Tock", "API REST", "JIRA"],
    image: "assets/chatbot-tilien.png",
    link: "https://www.transilien.com/en/page-medias/le-chatbot-transilien"
  },
  {
    title: "Assistant Virtuel - SNCF",
    description: "Développement d'un chatbot pour fournir des informations en temps réel aux voyageurs. " +
      "L'agent virtuel SNCF vous communique les arrêts et les éventuelles perturbations. Pour ce faire, indiquez-lui votre numéro de train ou de cars TER et LEX (Léman Express).",
    technologies: ["Java 11+", "Kotlin", "Reactjs", "MongoDB","Nginx", "Kubernetes", "AWS", "Git", "GitLab", "NLP", "Jenkins", "Tock", "API REST", "JIRA"],
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

