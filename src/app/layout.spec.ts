import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { THEME_STORAGE_KEY, ThemeService } from './core/theme.service';
import { ExperiencesComponent } from './experiences/experiences.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PROFILE } from './data/profile.data';

describe('Layout', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem(THEME_STORAGE_KEY);
  });

  it('AppComponent : lien d’évitement, header, main et footer', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('a.skip-link')?.getAttribute('href')).toBe('#contenu');
    expect(el.querySelector('main#contenu')).not.toBeNull();
    expect(el.querySelector('header')).not.toBeNull();
    expect(el.querySelector('footer')).not.toBeNull();
  });

  describe('NavbarComponent', () => {
    it('ouvre et ferme le menu mobile (aria-expanded, Échap)', () => {
      const fixture = TestBed.createComponent(NavbarComponent);
      fixture.detectChanges();
      const burger = fixture.nativeElement.querySelector('.burger') as HTMLButtonElement;
      expect(burger.getAttribute('aria-expanded')).toBe('false');
      burger.click();
      fixture.detectChanges();
      expect(burger.getAttribute('aria-expanded')).toBe('true');
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      fixture.detectChanges();
      expect(burger.getAttribute('aria-expanded')).toBe('false');
    });

    it('bascule le thème et le persiste', () => {
      const fixture = TestBed.createComponent(NavbarComponent);
      fixture.detectChanges();
      const theme = TestBed.inject(ThemeService);
      const initial = theme.theme();
      (fixture.nativeElement.querySelector('.theme-toggle') as HTMLButtonElement).click();
      fixture.detectChanges();
      const next = initial === 'dark' ? 'light' : 'dark';
      expect(theme.theme()).toBe(next);
      expect(document.documentElement.getAttribute('data-theme')).toBe(next);
      expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(next);
    });
  });

  describe('ExperiencesComponent (timeline)', () => {
    it('affiche toutes les entrées puis filtre par type', () => {
      const fixture = TestBed.createComponent(ExperiencesComponent);
      fixture.detectChanges();
      const count = () => fixture.nativeElement.querySelectorAll('.timeline__item').length;
      expect(count()).toBe(PROFILE.experiences.length + PROFILE.education.length);

      fixture.componentInstance.filter.set('education');
      fixture.detectChanges();
      expect(count()).toBe(PROFILE.education.length);

      fixture.componentInstance.filter.set('experience');
      fixture.detectChanges();
      expect(count()).toBe(PROFILE.experiences.length);
    });

    it('rend les placeholders TODO visibles', () => {
      const fixture = TestBed.createComponent(ExperiencesComponent);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('li.todo')).not.toBeNull();
    });
  });
});
