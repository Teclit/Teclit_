import { InjectionToken, Pipe, PipeTransform, inject, isDevMode } from '@angular/core';
import { isTodo } from '../data/profile.utils';

/**
 * Affiche-t-on les placeholders `TODO:` ?
 * - développement (`npm start`) : oui, surlignés pour repérer ce qu'il reste à compléter ;
 * - production (build / pré-rendu) : non, ils sont retirés et les blocs vides sont masqués.
 */
export const SHOW_TODOS = new InjectionToken<boolean>('SHOW_TODOS', {
  providedIn: 'root',
  factory: () => isDevMode(),
});

/** `{{ value | isTodo }}` → vrai si la valeur est un placeholder `TODO:` (sert au style). */
@Pipe({ name: 'isTodo' })
export class IsTodoPipe implements PipeTransform {
  transform(value: string | null | undefined): boolean {
    return isTodo(value);
  }
}

/** `@if (text | hasContent)` → vrai si le texte est non vide et affichable (TODO masqué en production). */
@Pipe({ name: 'hasContent' })
export class HasContentPipe implements PipeTransform {
  private readonly showTodos = inject(SHOW_TODOS);

  transform(value: string | null | undefined): boolean {
    return !!value?.trim() && (this.showTodos || !isTodo(value));
  }
}

/** `@for (x of list | withContent)` → retire les entrées vides et, en production, les TODO. */
@Pipe({ name: 'withContent' })
export class WithContentPipe implements PipeTransform {
  private readonly showTodos = inject(SHOW_TODOS);

  transform(values: readonly string[] | null | undefined): string[] {
    return (values ?? []).filter((v) => !!v.trim() && (this.showTodos || !isTodo(v)));
  }
}
