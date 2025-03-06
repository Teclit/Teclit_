// Définition d'un type explicite pour les liens de profil
type SocialLinks = {
  linkedIn: string;
  github: string;
  cvdesignr: string;
};

const COMPANY_NAME = 'Teklit Te...';
const SOCIAL_LINKS: SocialLinks = {
  linkedIn: 'https://www.linkedin.com/in/teklittewolde/',
  github: 'https://github.com/Teclit',
  cvdesignr: 'https://cvdesignr.com/p/5ca9b929ed8c4'
};


// data.ts
export interface SkillImage {
  name: string;
  url: string;
  alt: string;
}

const imgDirectory: string = "assets/logos/";

// List of skill images
export const SKILL_IMAGES: SkillImage[] = [
  {name: 'Angular', url: `${imgDirectory}angular.png`, alt: 'Angular Logo'},
  {name: 'React', url: `${imgDirectory}react.png`, alt: 'React Logo'},
  {name: 'Node', url: `${imgDirectory}nodejs.png`, alt: 'Node.js Logo'},
  {name: 'Java', url: `${imgDirectory}java.png`, alt: 'Java Logo'},
  {name: 'Python', url: `${imgDirectory}python.png`, alt: 'Python Logo'},
  {name: 'PHP', url: `${imgDirectory}php.png`, alt: 'php Logo'},
  {name: 'Spring Boot', url: `${imgDirectory}spring-boot.png`, alt: 'Spring Boot Logo'},
  {name: 'Kotlin', url: `${imgDirectory}kotlin.png`, alt: 'kotlin Logo'},
  {name: 'MongoDB', url: `${imgDirectory}mongodb.png`, alt: 'MongoDB Logo'},
  {name: 'Docker', url: `${imgDirectory}docker.png`, alt: 'Docker Logo'},
  {name: 'Kubernetes', url: `${imgDirectory}kubernetes.png`, alt: 'Kubernetes Logo'}
];

// Exportation centralisée pour faciliter l'importation ailleurs
export {COMPANY_NAME, SOCIAL_LINKS};
