import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container nf">
        <p class="eyebrow">Erreur 404</p>
        <h1 class="section__title">Page introuvable</h1>
        <p class="section__lead">La page demandée n'existe pas ou a été déplacée.</p>
        <a class="btn btn--primary" routerLink="/"><app-icon name="arrow-left" [size]="18" /> Retour à l'accueil</a>
      </div>
    </section>
  `,
  styles: `
    .nf {
      display: grid;
      justify-items: start;
      gap: var(--sp-4);
      min-height: 50vh;
      align-content: center;
    }
  `,
})
export class NotFoundComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Page introuvable',
      description: "La page demandée n'existe pas.",
      path: '/404',
      noindex: true,
    });
  }
}
