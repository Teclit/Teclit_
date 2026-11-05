import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { PROFILE } from '../data/profile.data';
import { CvPageComponent } from './cv-page/cv-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';

describe('Pages', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  describe('HomePageComponent', () => {
    it('rend toutes les sections et le JSON-LD Person', () => {
      const fixture = TestBed.createComponent(HomePageComponent);
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      for (const id of ['accueil', 'a-propos', 'parcours', 'competences', 'projets', 'formation', 'contact']) {
        expect(el.querySelector(`#${id}`))
          .withContext(id)
          .not.toBeNull();
      }
      expect(el.querySelectorAll('h1').length).toBe(1);
      const ld = document.head.querySelector('#jsonld-page')?.textContent ?? '';
      expect(JSON.parse(ld)['@type']).toBe('Person');
      expect(TestBed.inject(Title).getTitle()).toContain(PROFILE.identity.fullName);
      fixture.destroy();
      expect(document.head.querySelector('#jsonld-page')).toBeNull();
    });

    it('affiche une carte par projet avec un lien vers le détail', () => {
      const fixture = TestBed.createComponent(HomePageComponent);
      fixture.detectChanges();
      const links = Array.from(fixture.nativeElement.querySelectorAll('.pcard__link')) as HTMLAnchorElement[];
      expect(links.length).toBe(PROFILE.projects.length);
      expect(links.every((a) => a.getAttribute('href')?.startsWith('/projets/'))).toBeTrue();
    });
  });

  describe('ProjectDetailComponent', () => {
    it('affiche problème, solution, architecture, stack et résultats', () => {
      const fixture = TestBed.createComponent(ProjectDetailComponent);
      fixture.componentRef.setInput('slug', 'qcmplus');
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('h1')?.textContent).toContain('QCMPLUS');
      for (const id of ['d-problem', 'd-solution', 'd-archi', 'd-results', 'd-stack']) {
        expect(el.querySelector(`#${id}`))
          .withContext(id)
          .not.toBeNull();
      }
      expect(el.querySelector('.todo')).not.toBeNull();
      expect(TestBed.inject(Meta).getTag('property="og:title"')?.content).toContain('QCMPLUS');
    });

    it('affiche la page 404 pour un slug inconnu', () => {
      const fixture = TestBed.createComponent(ProjectDetailComponent);
      fixture.componentRef.setInput('slug', 'inexistant');
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Page introuvable');
    });
  });

  describe('CvPageComponent', () => {
    it('propose le CV en ligne, l’impression et liste toutes les expériences', () => {
      const fixture = TestBed.createComponent(CvPageComponent);
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector(`a[href="${PROFILE.identity.links.cvOnline}"]`)).not.toBeNull();
      expect(el.querySelectorAll('.resume__item').length).toBe(PROFILE.experiences.length);
      const print = spyOn(window, 'print');
      (el.querySelector('button') as HTMLButtonElement).click();
      expect(print).toHaveBeenCalled();
    });
  });
});
