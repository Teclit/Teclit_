import { provideRouter } from '@angular/router';
import { render, screen, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { AppComponent } from './app.component';
import { PROFILE } from './core/content/content.service';
import { THEME_STORAGE_KEY, ThemeService } from './core/theme.service';
import { ExperiencesComponent } from './experiences/experiences.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RealisationComponent } from './realisation/realisation.component';

const router = [provideRouter([])];

describe('Mise en page', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem(THEME_STORAGE_KEY);
  });

  it('AppComponent : lien d’évitement, header, main et footer', async () => {
    await render(AppComponent, { providers: router });
    expect(screen.getByRole('link', { name: 'Aller au contenu' }).getAttribute('href')).toBe('#contenu');
    expect(screen.getByRole('main').id).toBe('contenu');
    expect(screen.getByRole('banner')).toBeTruthy();
    expect(screen.getByRole('contentinfo')).toBeTruthy();
  });

  describe('NavbarComponent', () => {
    it('affiche le logo « Te. » et les liens de section', async () => {
      await render(NavbarComponent, { providers: router });
      const logo = screen.getByRole('link', { name: /TEWOLDE, accueil$/ });
      expect(logo.getAttribute('href')).toBe('/');
      const nav = screen.getByRole('navigation', { name: 'Navigation principale' });
      expect(within(nav).getByRole('link', { name: 'Projets' }).getAttribute('href')).toBe('/#projets');
    });

    it('ouvre et ferme le menu mobile (aria-expanded, Échap)', async () => {
      const user = userEvent.setup();
      await render(NavbarComponent, { providers: router });
      const burger = screen.getByRole('button', { name: 'Menu' });
      expect(burger.getAttribute('aria-expanded')).toBe('false');
      await user.click(burger);
      expect(burger.getAttribute('aria-expanded')).toBe('true');
      await user.keyboard('{Escape}');
      expect(burger.getAttribute('aria-expanded')).toBe('false');
    });

    it('bascule le thème et le persiste', async () => {
      const user = userEvent.setup();
      const { fixture } = await render(NavbarComponent, { providers: router });
      const theme = fixture.debugElement.injector.get(ThemeService);
      const next = theme.theme() === 'dark' ? 'light' : 'dark';
      await user.click(screen.getByRole('button', { name: 'Thème sombre' }));
      expect(theme.theme()).toBe(next);
      expect(document.documentElement.getAttribute('data-theme')).toBe(next);
      expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(next);
    });
  });

  describe('ExperiencesComponent (timeline)', () => {
    it('affiche toutes les entrées puis filtre par type', async () => {
      const user = userEvent.setup();
      await render(ExperiencesComponent, { providers: router });
      const count = () => screen.getAllByTestId('timeline-entry').length;
      expect(count()).toBe(PROFILE.experiences.length + PROFILE.education.length);
      await user.click(screen.getByRole('button', { name: 'Formations' }));
      expect(count()).toBe(PROFILE.education.length);
      await user.click(screen.getByRole('button', { name: 'Expériences' }));
      expect(count()).toBe(PROFILE.experiences.length);
    });

    it('déplie les détails d’une expérience (aria-expanded, contenu pré-rendu)', async () => {
      const user = userEvent.setup();
      await render(ExperiencesComponent, { providers: router });
      const toggle = screen.getAllByRole('button', { name: /Missions, objectifs et stack/ })[0];
      const details = document.getElementById(toggle.getAttribute('aria-controls') ?? '') as HTMLElement;
      expect(details.hidden).toBe(true);
      expect(details.textContent).toContain(PROFILE.experiences[0].missions[0]);
      await user.click(toggle);
      expect(toggle.getAttribute('aria-expanded')).toBe('true');
      expect(details.hidden).toBe(false);
    });

    it('masque « Réalisations chiffrées » quand la liste est vide', async () => {
      await render(ExperiencesComponent, { providers: router });
      expect(screen.queryByRole('heading', { name: 'Réalisations chiffrées' })).toBeNull();
    });
  });

  describe('RealisationComponent (filtres)', () => {
    it('filtre les projets par technologie puis réinitialise', async () => {
      const user = userEvent.setup();
      const { fixture } = await render(RealisationComponent, { providers: router });
      const tech = fixture.componentInstance['technologies'][0];
      const expected = PROFILE.projects.filter((p) => p.stack.includes(tech)).length;

      expect(screen.getAllByTestId('project-item').length).toBe(PROFILE.projects.length);
      const button = screen.getByRole('button', { name: tech });
      await user.click(button);
      expect(button.getAttribute('aria-pressed')).toBe('true');
      expect(screen.getAllByTestId('project-item').length).toBe(expected);
      expect(screen.getByRole('status').textContent).toContain(`${expected} projet`);

      await user.click(screen.getByRole('button', { name: /^Tous/ }));
      expect(screen.getAllByTestId('project-item').length).toBe(PROFILE.projects.length);
    });
  });
});
