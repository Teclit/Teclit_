import { ChangeDetectionStrategy, Component, DOCUMENT, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content/content.service';
import { SeoService } from '../../core/seo.service';
import { IconComponent } from '../../shared/icon/icon.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { CardComponent } from '../../shared/ui/card.component';

/** Page « CV » : CV en ligne et version imprimable générée depuis le contenu. */
@Component({
  selector: 'app-cv-page',
  imports: [RouterLink, IconComponent, ButtonComponent, CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container-page py-12 sm:py-16 print:p-0">
      <header class="print:hidden">
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-accent">Curriculum vitæ</p>
        <h1 class="mt-3 text-h2 font-extrabold">Télécharger mon CV</h1>
        <p class="mt-4 max-w-2xl text-lg text-muted">CV en ligne, ou version imprimable ci-dessous.</p>
        <div class="mt-6 flex flex-wrap gap-3">
          <a appButton variant="secondary" [href]="identity.links.cvOnline" target="_blank" rel="noopener noreferrer">
            <app-icon name="external" [size]="18" /> CV en ligne <span class="sr-only">(nouvel onglet)</span>
          </a>
          <button appButton variant="secondary" type="button" (click)="print()" data-testid="cv-print">
            <app-icon name="printer" [size]="18" /> Imprimer
          </button>
        </div>
      </header>

      <article
        appCard
        class="mt-10 space-y-8 sm:p-10 print:mt-0 print:border-0 print:p-0 print:shadow-none"
        aria-label="CV imprimable"
      >
        <header class="flex flex-wrap items-start justify-between gap-6 border-b border-border pb-6">
          <div>
            <h2 class="text-3xl font-extrabold tracking-tight">{{ identity.fullName }}</h2>
            <p class="mt-1 font-semibold text-accent">{{ identity.title }}</p>
          </div>
          <ul role="list" class="space-y-0.5 text-sm text-muted sm:text-right">
            <li>{{ identity.location }}</li>
            <li>
              <a [href]="'mailto:' + identity.links.email">{{ identity.links.email }}</a>
            </li>
            <li>{{ identity.phone }}</li>
            <li><a [href]="identity.links.linkedin">linkedin.com/in/teklittewolde</a></li>
            <li><a [href]="identity.links.github">github.com/Teclit</a></li>
          </ul>
        </header>

        <section>
          <h3 class="text-sm font-bold uppercase tracking-[0.18em] text-accent">Profil</h3>
          <p class="mt-2">{{ identity.shortBio }}</p>
        </section>

        <section>
          <h3 class="text-sm font-bold uppercase tracking-[0.18em] text-accent">Expériences</h3>
          @for (exp of content.experiences; track exp.id) {
            <div class="mt-4 break-inside-avoid" data-testid="resume-experience">
              <div class="flex flex-wrap justify-between gap-x-4">
                <strong>{{ exp.role }} — {{ exp.company }}</strong>
                <span class="text-sm text-muted">{{ exp.period }} · {{ exp.location }}</span>
              </div>
              <ul class="mt-1 list-disc space-y-0.5 pl-5 text-sm marker:text-accent">
                @for (mission of exp.missions.slice(0, 4); track $index) {
                  <li>{{ mission }}</li>
                }
              </ul>
              <p class="mt-1 text-sm text-muted">{{ exp.stack.join(', ') }}</p>
            </div>
          }
        </section>

        <section class="break-inside-avoid">
          <h3 class="text-sm font-bold uppercase tracking-[0.18em] text-accent">Compétences</h3>
          <dl class="mt-2 grid gap-2 text-sm">
            @for (group of content.skillGroups; track group.id) {
              <div class="grid gap-x-4 sm:grid-cols-[14rem_1fr]">
                <dt class="font-semibold">{{ group.title }}</dt>
                <dd class="text-muted">{{ group.skills.join(', ') }}</dd>
              </div>
            }
          </dl>
        </section>

        <section class="break-inside-avoid">
          <h3 class="text-sm font-bold uppercase tracking-[0.18em] text-accent">Formation</h3>
          @for (edu of content.education; track edu.id) {
            <div class="mt-2 flex flex-wrap justify-between gap-x-4 text-sm">
              <span
                ><strong>{{ edu.title }}</strong
                >{{ edu.level ? ' — ' + edu.level : '' }} · {{ edu.school }}</span
              >
              <span class="text-muted">{{ edu.period }}</span>
            </div>
          }
        </section>

        <section>
          <h3 class="text-sm font-bold uppercase tracking-[0.18em] text-accent">Langues</h3>
          <p class="mt-2 text-sm">
            @for (lang of content.languages; track lang.name; let last = $last) {
              {{ lang.name }} ({{ lang.level }}){{ last ? '' : ' · ' }}
            }
          </p>
        </section>
      </article>

      <p class="mt-8 print:hidden"><a routerLink="/" class="font-medium text-accent">← Retour au portfolio</a></p>
    </div>
  `,
})
export class CvPageComponent {
  protected readonly content = inject(ContentService);
  private readonly document = inject(DOCUMENT);

  protected readonly identity = this.content.identity;

  constructor() {
    inject(SeoService).update({
      title: 'CV — Télécharger',
      description: `Téléchargez le CV de ${this.identity.fullName}, développeur Full Stack Java / Kotlin, Spring Boot, Node.js / NestJS.`,
      path: '/cv',
    });
  }

  print(): void {
    this.document.defaultView?.print();
  }
}
