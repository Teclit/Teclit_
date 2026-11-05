import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, DOCUMENT, PLATFORM_ID, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, skip } from 'rxjs';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ScrollProgressComponent } from './shared/ui/scroll-progress.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ScrollProgressComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      href="#contenu"
      class="sr-only z-100 rounded-full bg-accent px-4 py-2 font-semibold text-accent-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
      >Aller au contenu</a
    >
    <app-scroll-progress />
    <app-navbar />
    <main id="contenu" tabindex="-1" class="outline-none">
      <router-outlet />
    </main>
    <app-footer />
  `,
})
export class AppComponent {
  constructor() {
    const document = inject(DOCUMENT);
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;

    // Gestion du focus au changement de page (hors ancres) : le titre de la
    // nouvelle page est focalisé et annoncé par les lecteurs d'écran.
    inject(Router)
      .events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        skip(1),
        filter((e) => !e.urlAfterRedirects.includes('#')),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        setTimeout(() => {
          const target = document.querySelector<HTMLElement>('main h1') ?? document.getElementById('contenu');
          if (!target) return;
          if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        });
      });
  }
}
