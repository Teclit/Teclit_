import { Injectable } from '@angular/core';
import profileJson from '../../../content/profile.json';
import type { Profile, Project, SectionKey } from '../../data/profile.model';
import {
  buildTimeline,
  findExperience,
  findProject,
  rankTechnologies,
  sortExperiences,
} from '../../data/profile.utils';

/**
 * Le contenu est validé par le schéma Zod au build et en CI : ici on se contente
 * de le typer, sans embarquer Zod dans le bundle client.
 */
export const PROFILE = profileJson as Profile;

/** Accès typé et centralisé au contenu du portfolio (`src/content/profile.json`). */
@Injectable({ providedIn: 'root' })
export class ContentService {
  readonly profile: Profile = PROFILE;
  readonly identity = PROFILE.identity;
  readonly projects = PROFILE.projects;
  readonly skillGroups = PROFILE.skillGroups;
  readonly education = PROFILE.education;
  readonly certifications = PROFILE.certifications;
  readonly languages = PROFILE.languages;
  readonly techLogos = PROFILE.techLogos;

  /** Expériences triées de la plus récente à la plus ancienne. */
  readonly experiences = sortExperiences(PROFILE.experiences);
  /** Expériences et formations fusionnées, triées chronologiquement (décroissant). */
  readonly timeline = buildTimeline(PROFILE.experiences, PROFILE.education);
  /** Projets mis en avant d'abord, ordre du fichier conservé sinon. */
  readonly orderedProjects: readonly Project[] = [
    ...PROFILE.projects.filter((p) => p.featured),
    ...PROFILE.projects.filter((p) => !p.featured),
  ];
  /** Technologies les plus utilisées dans les projets (filtres de la grille). */
  readonly projectTechnologies = rankTechnologies(PROFILE.projects, 8);

  section(key: SectionKey) {
    return PROFILE.sections[key];
  }

  project(slug: string | null | undefined) {
    return findProject(PROFILE, slug);
  }

  experience(id: string | undefined) {
    return findExperience(PROFILE, id);
  }
}
