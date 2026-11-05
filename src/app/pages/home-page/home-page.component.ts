import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AproposComponent } from '../../apropos/apropos.component';
import { CompetencesComponent } from '../../competences/competences.component';
import { ContactComponent } from '../../contact/contact.component';
import { SeoService } from '../../core/seo.service';
import { PROFILE } from '../../data/profile.data';
import { buildPersonJsonLd } from '../../data/profile.utils';
import { ExperiencesComponent } from '../../experiences/experiences.component';
import { FormationComponent } from '../../formation/formation.component';
import { HomeComponent } from '../../home/home.component';
import { RealisationComponent } from '../../realisation/realisation.component';

@Component({
  selector: 'app-home-page',
  imports: [
    HomeComponent,
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
    <app-apropos />
    <app-experiences />
    <app-competences />
    <app-realisation />
    <app-formation />
    <app-contact />
  `,
})
export class HomePageComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: `${PROFILE.identity.fullName} — Développeur Full Stack Java / Kotlin, Spring Boot, Node.js`,
      description: PROFILE.identity.shortBio,
      path: '/',
      type: 'profile',
    });
    this.seo.setJsonLd(buildPersonJsonLd(PROFILE));
  }

  ngOnDestroy(): void {
    this.seo.setJsonLd(null);
  }
}
