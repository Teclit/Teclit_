import { z } from 'zod';

/**
 * Schéma (Zod) du contenu du portfolio stocké dans `src/content/profile.json`.
 * Les types TypeScript en sont dérivés (`profile.model.ts`). Le contenu est validé
 * au build (`scripts/generate-seo.mjs`) et par les tests unitaires : le bundle
 * client n'embarque pas ce schéma.
 */

const nonEmpty = z.string().trim().min(1);
/** `YYYY-MM` ou `YYYY`. */
const yearMonth = z.string().regex(/^\d{4}(-\d{2})?$/, 'Format attendu : YYYY-MM');
const assetPath = z.string().regex(/^(assets|cv)\/[\w./-]+$/, 'Chemin relatif à public/ attendu');

export const ICON_NAMES = [
  'arrow-right',
  'arrow-left',
  'briefcase',
  'check',
  'chevron-down',
  'close',
  'cloud',
  'code',
  'database',
  'download',
  'external',
  'github',
  'graduation',
  'layout',
  'linkedin',
  'mail',
  'map-pin',
  'menu',
  'moon',
  'phone',
  'printer',
  'server',
  'shield',
  'sun',
  'users',
  'workflow',
] as const;

export const ImageSchema = z.object({
  src: assetPath,
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const SectionCopySchema = z.object({
  eyebrow: nonEmpty,
  title: nonEmpty,
  lead: z.string(),
});

export const ProfileSchema = z.object({
  sections: z.object({
    about: SectionCopySchema,
    career: SectionCopySchema,
    skills: SectionCopySchema,
    projects: SectionCopySchema,
    education: SectionCopySchema,
    contact: SectionCopySchema,
  }),
  identity: z.object({
    firstName: nonEmpty,
    lastName: nonEmpty,
    fullName: nonEmpty,
    /** Nom court affiché dans l'en-tête. */
    brand: nonEmpty,
    title: nonEmpty,
    tagline: nonEmpty,
    shortBio: nonEmpty,
    longBio: z.array(nonEmpty).min(1),
    location: nonEmpty,
    phone: nonEmpty,
    availability: nonEmpty,
    qualities: z.array(nonEmpty),
    photo: ImageSchema,
    /** URL publique du site (canonical, sitemap, Open Graph). Peut être surchargée par `SITE_URL`. */
    siteUrl: z.union([z.literal(''), z.url()]),
    links: z.object({
      github: z.url(),
      linkedin: z.url(),
      email: z.email(),
      cvOnline: z.url(),
      /** CV PDF : chemin dans `public/` ou URL externe (null tant que non fourni). */
      cvPdf: z.union([assetPath, z.url()]).nullable(),
    }),
    /** Intitulés animés du hero (le premier est rendu côté serveur). */
    roles: z.array(nonEmpty).min(1),
    highlights: z.array(nonEmpty),
    facts: z.array(z.object({ label: nonEmpty, value: nonEmpty })),
    practicalInfo: z.array(nonEmpty),
  }),
  experiences: z.array(
    z.object({
      id: nonEmpty,
      company: nonEmpty,
      role: nonEmpty,
      kind: z.enum(['emploi', 'alternance', 'stage', 'projet']),
      start: yearMonth,
      end: yearMonth,
      /** Libellé de période affiché tel quel. */
      period: nonEmpty,
      location: z.string(),
      context: z.string(),
      goals: z.string(),
      missions: z.array(nonEmpty),
      /** Réalisations chiffrées (uniquement si fournies). */
      achievements: z.array(z.string()),
      stack: z.array(nonEmpty),
      demonstratedSkills: z.array(nonEmpty),
      /** Projets (slugs) liés à cette expérience. */
      projectSlugs: z.array(nonEmpty),
    }),
  ),
  projects: z.array(
    z.object({
      slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
      title: nonEmpty,
      summary: nonEmpty,
      image: ImageSchema,
      link: z.url().optional(),
      repository: z.url().optional(),
      /** Expérience rattachée (id), si connue. */
      experienceId: z.string().optional(),
      featured: z.boolean(),
      problem: z.string(),
      solution: z.string(),
      architecture: z.array(z.string()),
      stack: z.array(nonEmpty).min(1),
    }),
  ),
  skillGroups: z.array(
    z.object({
      id: nonEmpty,
      title: nonEmpty,
      icon: z.enum(ICON_NAMES),
      description: z.string(),
      skills: z.array(nonEmpty).min(1),
    }),
  ),
  languages: z.array(z.object({ name: nonEmpty, level: nonEmpty })),
  education: z.array(
    z.object({
      id: nonEmpty,
      start: yearMonth,
      end: yearMonth,
      period: nonEmpty,
      title: nonEmpty,
      level: z.string().optional(),
      school: nonEmpty,
      location: z.string().optional(),
    }),
  ),
  certifications: z.array(z.object({ name: nonEmpty, issuer: nonEmpty, date: nonEmpty, url: z.url().optional() })),
  techLogos: z.array(z.object({ name: nonEmpty, src: assetPath })),
});

/** Vérifie aussi les références croisées (slugs de projets, ids d'expériences). */
export const ProfileWithRefsSchema = ProfileSchema.superRefine((profile, ctx) => {
  const slugs = new Set(profile.projects.map((p) => p.slug));
  const experienceIds = new Set(profile.experiences.map((e) => e.id));
  if (slugs.size !== profile.projects.length) ctx.addIssue({ code: 'custom', message: 'Slugs de projets dupliqués' });
  profile.experiences.forEach((exp, i) =>
    exp.projectSlugs.forEach((slug) => {
      if (!slugs.has(slug)) {
        ctx.addIssue({ code: 'custom', path: ['experiences', i, 'projectSlugs'], message: `Projet inconnu : ${slug}` });
      }
    }),
  );
  profile.projects.forEach((p, i) => {
    if (p.experienceId && !experienceIds.has(p.experienceId)) {
      ctx.addIssue({
        code: 'custom',
        path: ['projects', i, 'experienceId'],
        message: `Expérience inconnue : ${p.experienceId}`,
      });
    }
  });
});
