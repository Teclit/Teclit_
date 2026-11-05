import {
  buildPersonJsonLd,
  buildTimeline,
  filledUrl,
  findProject,
  rankTechnologies,
  sortExperiences,
} from '../../data/profile.utils';
import { PROFILE } from './content.service';
import { ProfileWithRefsSchema } from './profile.schema';

const YEAR_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

describe('PROFILE (intégrité de src/content/profile.json)', () => {
  it('respecte le schéma Zod (types, formats, références croisées)', () => {
    const result = ProfileWithRefsSchema.safeParse(PROFILE);
    expect(result.error?.issues ?? []).toEqual([]);
  });

  it('ne contient aucun placeholder TODO', () => {
    expect(JSON.stringify(PROFILE)).not.toContain('TODO');
  });

  it('a des slugs de projets uniques et URL-safe', () => {
    const slugs = PROFILE.projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it('a des identifiants uniques pour les expériences et formations', () => {
    const ids = [...PROFILE.experiences.map((e) => e.id), ...PROFILE.education.map((e) => e.id)];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('utilise des dates YYYY-MM cohérentes (début <= fin)', () => {
    for (const item of [...PROFILE.experiences, ...PROFILE.education]) {
      expect(item.start, item.id).toMatch(YEAR_MONTH);
      expect(item.end, item.id).toMatch(YEAR_MONTH);
      expect(item.start <= item.end, item.id).toBe(true);
    }
  });

  it('relie expériences et projets de façon cohérente', () => {
    for (const exp of PROFILE.experiences) {
      for (const slug of exp.projectSlugs) {
        const project = findProject(PROFILE, slug);
        expect(project, slug).toBeDefined();
        expect(project?.experienceId, slug).toBe(exp.id);
      }
    }
    for (const project of PROFILE.projects.filter((p) => p.experienceId)) {
      expect(
        PROFILE.experiences.some((e) => e.id === project.experienceId),
        project.slug,
      ).toBe(true);
    }
  });

  it('renseigne une stack et des missions pour chaque expérience', () => {
    for (const exp of PROFILE.experiences) {
      expect(exp.stack.length, exp.id).toBeGreaterThan(0);
      expect(exp.missions.length, exp.id).toBeGreaterThan(0);
    }
  });

  it('utilise des liens externes en https', () => {
    const urls = [
      PROFILE.identity.links.github,
      PROFILE.identity.links.linkedin,
      PROFILE.identity.links.cvOnline,
      ...PROFILE.projects.flatMap((p) => [p.link, p.repository]).filter((u): u is string => !!u),
    ];
    for (const url of urls) expect(url).toMatch(/^https:\/\//);
  });

  it('couvre les groupes de compétences attendus', () => {
    const ids = PROFILE.skillGroups.map((g) => g.id);
    for (const id of ['backend', 'frontend', 'devops', 'quality', 'methods']) expect(ids).toContain(id);
  });
});

describe('profile.utils', () => {
  it('filledUrl', () => {
    expect(filledUrl('https://ok.fr')).toBe('https://ok.fr');
    expect(filledUrl('')).toBeNull();
    expect(filledUrl('   ')).toBeNull();
    expect(filledUrl(null)).toBeNull();
  });

  it('trie les expériences de la plus récente à la plus ancienne', () => {
    const sorted = sortExperiences(PROFILE.experiences);
    expect(sorted[0].id).toBe('tx-studio');
    expect(sorted[sorted.length - 1].id).toBe('webbel');
  });

  it('construit une timeline complète et triée', () => {
    const timeline = buildTimeline(PROFILE.experiences, PROFILE.education);
    expect(timeline.length).toBe(PROFILE.experiences.length + PROFILE.education.length);
    for (let i = 1; i < timeline.length; i++) {
      expect(timeline[i - 1].sortKey >= timeline[i].sortKey).toBe(true);
    }
  });

  it('classe les technologies des projets par fréquence', () => {
    const ranked = rankTechnologies(PROFILE.projects, 5);
    expect(ranked.length).toBeLessThanOrEqual(5);
    const count = (t: string) => PROFILE.projects.filter((p) => p.stack.includes(t)).length;
    for (let i = 1; i < ranked.length; i++) expect(count(ranked[i - 1])).toBeGreaterThanOrEqual(count(ranked[i]));
  });

  it('génère un JSON-LD Person valide', () => {
    const ld = buildPersonJsonLd(PROFILE);
    expect(ld['@type']).toBe('Person');
    expect(ld['name']).toBe('Teklit TEWOLDE');
    expect(ld['sameAs']).toEqual([PROFILE.identity.links.github, PROFILE.identity.links.linkedin]);
  });
});
