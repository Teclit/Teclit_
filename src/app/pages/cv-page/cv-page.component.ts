import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { PROFILE } from '../../data/profile.data';
import { sortExperiences } from '../../data/profile.utils';
import { IconComponent } from '../../shared/icon/icon.component';

/** Page « CV » : téléchargement du PDF + version imprimable générée depuis la source de données. */
@Component({
  selector: 'app-cv-page',
  imports: [RouterLink, IconComponent],
  templateUrl: './cv-page.component.html',
  styleUrl: './cv-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvPageComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly document = inject(DOCUMENT);

  protected readonly identity = PROFILE.identity;
  protected readonly experiences = sortExperiences(PROFILE.experiences);
  protected readonly education = PROFILE.education;
  protected readonly skillGroups = PROFILE.skillGroups;
  protected readonly languages = PROFILE.languages;
  protected readonly cvPdf = PROFILE.identity.links.cvPdf;
  protected readonly cvPdfName = `CV-${PROFILE.identity.firstName}-${PROFILE.identity.lastName}.pdf`;

  ngOnInit(): void {
    this.seo.update({
      title: 'CV — Télécharger',
      description: `Téléchargez le CV de ${PROFILE.identity.fullName}, développeur Full Stack Java / Kotlin, Spring Boot, Node.js / NestJS.`,
      path: '/cv',
    });
  }

  print(): void {
    this.document.defaultView?.print();
  }
}
