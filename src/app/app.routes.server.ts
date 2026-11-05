import { RenderMode, ServerRoute } from '@angular/ssr';
import { PROFILE } from './core/content/content.service';

/**
 * Pages statiques pré-rendues au build (SSG) ; le reste (404) est rendu
 * à la demande par le serveur Express (SSR), avec le bon code HTTP.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'cv', renderMode: RenderMode.Prerender },
  {
    path: 'projets/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => PROFILE.projects.map((p) => ({ slug: p.slug })),
  },
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
