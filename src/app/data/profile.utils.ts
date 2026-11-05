import type { Education, Experience, Profile, Project } from './profile.model';

/** Retourne la valeur si elle est renseignée (non vide), sinon null. */
export function filledUrl(value: string | null | undefined): string | null {
  return value?.trim() ? value.trim() : null;
}

/** Compare deux dates `YYYY-MM` (ordre décroissant). */
export function compareYearMonthDesc(a: string, b: string): number {
  return b.localeCompare(a);
}

export type TimelineEntry =
  | { kind: 'experience'; key: string; sortKey: string; item: Experience }
  | { kind: 'education'; key: string; sortKey: string; item: Education };

/** Fusionne expériences et formations en une timeline triée du plus récent au plus ancien. */
export function buildTimeline(experiences: readonly Experience[], education: readonly Education[]): TimelineEntry[] {
  const entries: TimelineEntry[] = [
    ...experiences.map((item) => ({ kind: 'experience' as const, key: `exp-${item.id}`, sortKey: item.end, item })),
    ...education.map((item) => ({ kind: 'education' as const, key: `edu-${item.id}`, sortKey: item.end, item })),
  ];
  return entries.sort(
    (a, b) => compareYearMonthDesc(a.sortKey, b.sortKey) || compareYearMonthDesc(a.item.start, b.item.start),
  );
}

export function sortExperiences(experiences: readonly Experience[]): Experience[] {
  return [...experiences].sort((a, b) => compareYearMonthDesc(a.end, b.end) || compareYearMonthDesc(a.start, b.start));
}

export function findProject(profile: Profile, slug: string | null | undefined): Project | undefined {
  return slug ? profile.projects.find((p) => p.slug === slug) : undefined;
}

export function findExperience(profile: Profile, id: string | undefined): Experience | undefined {
  return id ? profile.experiences.find((e) => e.id === id) : undefined;
}

/** Données structurées schema.org `Person` (JSON-LD). */
export function buildPersonJsonLd(profile: Profile): Record<string, unknown> {
  const { identity } = profile;
  const site = filledUrl(identity.siteUrl);
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: identity.fullName,
    givenName: identity.firstName,
    familyName: identity.lastName,
    jobTitle: 'Développeur Full Stack',
    description: identity.shortBio,
    email: `mailto:${identity.links.email}`,
    ...(site ? { url: site, image: `${site.replace(/\/$/, '')}/og-image.png` } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Vaires-sur-Marne',
      postalCode: '77360',
      addressRegion: 'Île-de-France',
      addressCountry: 'FR',
    },
    sameAs: [identity.links.github, identity.links.linkedin],
    knowsLanguage: profile.languages.map((l) => l.name),
    knowsAbout: profile.skillGroups.flatMap((g) => g.skills).slice(0, 30),
    alumniOf: profile.education.map((e) => ({ '@type': 'EducationalOrganization', name: e.school })),
  };
}
