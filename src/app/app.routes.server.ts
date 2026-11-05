import { RenderMode, ServerRoute } from '@angular/ssr';
import { PROFILE } from './data/profile.data';

/** Toutes les pages sont pré-rendues au build (SSG) : HTML complet pour le SEO et le LCP. */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'cv', renderMode: RenderMode.Prerender },
  {
    path: 'projets/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => PROFILE.projects.map((p) => ({ slug: p.slug })),
  },
  { path: '**', renderMode: RenderMode.Client },
];
