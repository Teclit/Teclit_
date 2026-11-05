/**
 * Types du contenu du portfolio, dérivés du schéma Zod (source de vérité).
 * Import « type only » : le schéma n'est pas embarqué dans le bundle client.
 */
import type { z } from 'zod';
import type { ICON_NAMES, ProfileSchema } from '../core/content/profile.schema';

export type Profile = z.infer<typeof ProfileSchema>;
export type Identity = Profile['identity'];
export type SectionCopy = Profile['sections']['about'];
export type SectionKey = keyof Profile['sections'];
export type Image = Identity['photo'];
export type Experience = Profile['experiences'][number];
export type ExperienceKind = Experience['kind'];
export type Project = Profile['projects'][number];
export type SkillGroup = Profile['skillGroups'][number];
export type Education = Profile['education'][number];
export type Certification = Profile['certifications'][number];
export type Language = Profile['languages'][number];
export type TechLogo = Profile['techLogos'][number];
export type IconName = (typeof ICON_NAMES)[number];

/** Date au format `YYYY-MM` (ou `YYYY`). */
export type YearMonth = string;
