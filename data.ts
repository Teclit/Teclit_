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


// Exportation centralisée pour faciliter l'importation ailleurs
export {COMPANY_NAME, SOCIAL_LINKS};


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

];
