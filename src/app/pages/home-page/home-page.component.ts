import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject } from '@angular/core';
import { AproposComponent } from '../../apropos/apropos.component';
import { CompetencesComponent } from '../../competences/competences.component';
import { ContactComponent } from '../../contact/contact.component';
import { ContentService } from '../../core/content/content.service';
import { ScrollSpyService } from '../../core/scroll-spy.service';
import { SeoService } from '../../core/seo.service';
import { buildPersonJsonLd } from '../../data/profile.utils';
import { ExperiencesComponent } from '../../experiences/experiences.component';
import { FormationComponent } from '../../formation/formation.component';
import { HomeComponent } from '../../home/home.component';
import { NAV_LINKS } from '../../navbar/navbar.component';
import { RealisationComponent } from '../../realisation/realisation.component';
import { SectionComponent } from '../../shared/ui/section.component';

/**
 * Page d'accueil. Les sections sous la ligne de flottaison sont dans des blocs
 * `@defer` : HTML complet pré-rendu (SEO, ancres), JS chargé et hydraté seulement
 * à l'approche de la section (hydratation incrémentale).
 */
@Component({
  selector: 'app-home-page',
  imports: [
    HomeComponent,
    SectionComponent,
    AproposComponent,
    ExperiencesComponent,
    CompetencesComponent,
    RealisationComponent,
    FormationComponent,
    ContactComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-home />

    <app-section anchor="a-propos" [copy]="content.section('about')" alt>
      <app-apropos />
    </app-section>

    <app-section anchor="parcours" [copy]="content.section('career')">
      @defer (on viewport; prefetch on idle; hydrate on viewport) {
        <app-experiences />
      } @placeholder {
        <div class="min-h-[60rem]"></div>
      }
    </app-section>

    <app-section anchor="competences" [copy]="content.section('skills')" alt>
      @defer (on viewport; prefetch on idle; hydrate on viewport) {
        <app-competences />
      } @placeholder {
        <div class="min-h-[50rem]"></div>
      }
    </app-section>

    <app-section anchor="projets" [copy]="content.section('projects')">
      @defer (on viewport; prefetch on idle; hydrate on viewport) {
        <app-realisation />
      } @placeholder {
        <div class="min-h-[60rem]"></div>
      }
    </app-section>

    <app-section anchor="formation" [copy]="content.section('education')" alt>
      @defer (on viewport; prefetch on idle; hydrate on viewport) {
        <app-formation />
      } @placeholder {
        <div class="min-h-[24rem]"></div>
      }
    </app-section>

    <app-section anchor="contact" [copy]="content.section('contact')">
      @defer (on viewport; prefetch on idle; hydrate on idle) {
        <!-- hydratation dès que le navigateur est inactif : formulaire prêt avant toute saisie -->
        <app-contact />
      } @placeholder {
        <div class="min-h-[36rem]"></div>
      }
    </app-section>
  `,
})
export class HomePageComponent {
  protected readonly content = inject(ContentService);
  private readonly seo = inject(SeoService);
  private readonly spy = inject(ScrollSpyService);

  constructor() {
    const { identity } = this.content;
    this.seo.update({
      title: `${identity.fullName} — Développeur Full Stack Java / Kotlin, Spring Boot, Node.js`,
      description: identity.shortBio,
      path: '/',
      type: 'profile',
    });
    this.seo.setJsonLd(buildPersonJsonLd(this.content.profile));

    afterNextRender(() => this.spy.observe(NAV_LINKS.map((l) => l.fragment)));
    inject(DestroyRef).onDestroy(() => {
      this.spy.disconnect();
      this.seo.setJsonLd(null);
    });
  }
}
