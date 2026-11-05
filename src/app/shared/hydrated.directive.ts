import { Directive, afterNextRender, signal } from '@angular/core';

/**
 * Pose `data-hydrated` sur l'hôte une fois le composant rendu / hydraté côté client.
 * Signal déterministe pour les tests e2e (le HTML pré-rendu ne le contient pas).
 */
@Directive({
  selector: '[appHydrated]',
  host: { '[attr.data-hydrated]': 'hydrated() ? "" : null' },
})
export class HydratedDirective {
  protected readonly hydrated = signal(false);

  constructor() {
    afterNextRender(() => this.hydrated.set(true));
  }
}
