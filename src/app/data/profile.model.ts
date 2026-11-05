/**
 * Modèle typé de toutes les données du portfolio.
 * Un champ texte vide ou une liste vide masque le bloc correspondant à l'affichage.
 */

/** Date au format `YYYY-MM` (ou `YYYY`). */
export type YearMonth = string;

export interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
  /** CV en ligne (CVDesignR). */
  cvOnline: string;
  /** Chemin du CV PDF dans `public/` (null tant que le fichier n'est pas fourni). */
  cvPdf: string | null;
}

export interface Identity {
  firstName: string;
  lastName: string;
  fullName: string;
  /** Nom court affiché dans l'en-tête. */
  brand: string;
  title: string;
  tagline: string;
  shortBio: string;
  longBio: string[];
  location: string;
  phone: string;
  availability: string;
  qualities: string[];
  photo: Image;
  /** URL publique du site (canonical, sitemap, Open Graph). */
  siteUrl: string;
  links: SocialLinks;
}

export interface Image {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export type ExperienceKind = 'emploi' | 'alternance' | 'stage' | 'projet';

export interface Experience {
  id: string;
  company: string;
  role: string;
  kind: ExperienceKind;
  /** Début (YYYY-MM) — sert au tri chronologique. */
  start: YearMonth;
  /** Fin (YYYY-MM). */
  end: YearMonth;
  /** Libellé de période affiché tel quel. */
  period: string;
  location: string;
  context: string;
  goals: string;
  missions: string[];
  /** Réalisations chiffrées (uniquement si fournies). */
  achievements: string[];
  stack: string[];
  demonstratedSkills: string[];
  /** Projets (slugs) liés à cette expérience. */
  projectSlugs: string[];
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  image: Image;
  link?: string;
  repository?: string;
  /** Expérience rattachée (id), si connue. */
  experienceId?: string;
  featured: boolean;
  problem: string;
  solution: string;
  architecture: string[];
  stack: string[];
}

export interface SkillGroup {
  id: string;
  title: string;
  icon: IconName;
  description: string;
  skills: string[];
}

export interface Education {
  id: string;
  start: YearMonth;
  end: YearMonth;
  period: string;
  title: string;
  level?: string;
  school: string;
  location?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface TechLogo {
  name: string;
  src: string;
}

export type IconName =
  | 'arrow-right'
  | 'arrow-left'
  | 'briefcase'
  | 'check'
  | 'close'
  | 'cloud'
  | 'code'
  | 'database'
  | 'download'
  | 'external'
  | 'github'
  | 'graduation'
  | 'layout'
  | 'linkedin'
  | 'mail'
  | 'map-pin'
  | 'menu'
  | 'moon'
  | 'phone'
  | 'printer'
  | 'server'
  | 'shield'
  | 'sun'
  | 'users'
  | 'workflow';

export interface Profile {
  identity: Identity;
  experiences: Experience[];
  projects: Project[];
  skillGroups: SkillGroup[];
  languages: Language[];
  education: Education[];
  certifications: Certification[];
  techLogos: TechLogo[];
}
