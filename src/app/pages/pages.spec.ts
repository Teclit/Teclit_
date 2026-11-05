import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { PROFILE } from '../core/content/content.service';
import { responsiveImageLoader } from '../core/image-loader';
import { CvPageComponent } from './cv-page/cv-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';

const providers = [provideRouter([]), provideHttpClient(), provideHttpClientTesting()];

describe('Pages', () => {
  describe('HomePageComponent', () => {
    it('rend le hero, les ancres de toutes les sections et le JSON-LD Person', async () => {
      const { fixture } = await render(HomePageComponent, { providers });
      const el: HTMLElement = fixture.nativeElement;
      for (const id of ['accueil', 'a-propos', 'parcours', 'competences', 'projets', 'formation', 'contact']) {
        expect(el.querySelector(`#${id}`), id).not.toBeNull();
      }
      expect(screen.getAllByRole('heading', { level: 1 }).length).toBe(1);
      expect(screen.getByRole('heading', { level: 2, name: PROFILE.sections.projects.title })).toBeTruthy();
      const ld = document.head.querySelector('#jsonld-page')?.textContent ?? '';
      expect(JSON.parse(ld)['@type']).toBe('Person');
      expect(TestBed.inject(Title).getTitle()).toContain(PROFILE.identity.fullName);
      fixture.destroy();
      expect(document.head.querySelector('#jsonld-page')).toBeNull();
    });

    it("n'affiche aucun TODO", async () => {
      const { fixture } = await render(HomePageComponent, { providers });
      expect(fixture.nativeElement.textContent).not.toContain('TODO');
    });
  });

  describe('ProjectDetailComponent', () => {
    it('affiche problème, solution, architecture et stack + meta Open Graph', async () => {
      const { fixture } = await render(ProjectDetailComponent, { providers, inputs: { slug: 'qcmplus' } });
      const el: HTMLElement = fixture.nativeElement;
      expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('QCMPLUS');
      for (const id of ['d-problem', 'd-solution', 'd-archi', 'd-stack']) {
        expect(el.querySelector(`#${id}`), id).not.toBeNull();
      }
      expect(TestBed.inject(Meta).getTag('property="og:title"')?.content).toContain('QCMPLUS');
      expect(screen.getByRole('navigation', { name: 'Autres projets' })).toBeTruthy();
    });

    it('masque les blocs vides (pas de « Problème » sans contenu)', async () => {
      const { fixture } = await render(ProjectDetailComponent, { providers, inputs: { slug: 'cs-le-club' } });
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('#d-problem')).toBeNull();
      expect(el.querySelector('#d-solution')).not.toBeNull();
    });

    it('affiche la page 404 pour un slug inconnu', async () => {
      await render(ProjectDetailComponent, { providers, inputs: { slug: 'inexistant' } });
      expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Page introuvable');
    });
  });

  describe('CvPageComponent', () => {
    it('propose le PDF, le CV en ligne et l’impression, et liste toutes les expériences', async () => {
      await render(CvPageComponent, { providers });
      expect(screen.getByRole('link', { name: /CV en ligne/ }).getAttribute('href')).toBe(
        PROFILE.identity.links.cvOnline,
      );
      const cvPdf = PROFILE.identity.links.cvPdf;
      if (cvPdf) {
        const expected = /^https?:\/\//.test(cvPdf) ? cvPdf : `/${cvPdf}`;
        expect(screen.getByTestId('cv-download').getAttribute('href')).toBe(expected);
      }
      expect(screen.getAllByTestId('resume-experience').length).toBe(PROFILE.experiences.length);
      const print = vi.spyOn(window, 'print').mockReturnValue(undefined);
      screen.getByTestId('cv-print').click();
      expect(print).toHaveBeenCalled();
    });
  });

  describe('responsiveImageLoader', () => {
    it('produit les variantes AVIF 320 / 640', () => {
      expect(responsiveImageLoader({ src: 'assets/projects/qcmplus.webp', width: 300 })).toBe(
        '/assets/projects/qcmplus-320.avif',
      );
      expect(responsiveImageLoader({ src: 'assets/images/profile-640.webp', width: 500 })).toBe(
        '/assets/images/profile-640.avif',
      );
      expect(responsiveImageLoader({ src: 'assets/images/profile-640.webp' })).toBe('/assets/images/profile-640.avif');
    });
  });
});
