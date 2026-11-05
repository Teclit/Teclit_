import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { IconComponent } from '../../shared/icon/icon.component';
import { ButtonComponent } from '../../shared/ui/button.component';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, IconComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container-page grid min-h-[60vh] content-center justify-items-start gap-4 py-16">
      <p class="text-xs font-bold uppercase tracking-[0.18em] text-accent">Erreur 404</p>
      <h1 class="text-h2 font-extrabold">Page introuvable</h1>
      <p class="text-lg text-muted">La page demandée n'existe pas ou a été déplacée.</p>
      <a appButton routerLink="/"><app-icon name="arrow-left" [size]="18" /> Retour à l'accueil</a>
    </section>
  `,
})
export class NotFoundComponent {
  constructor() {
    inject(SeoService).update({
      title: 'Page introuvable',
      description: "La page demandée n'existe pas.",
      path: '/404',
      noindex: true,
    });
  }
}
