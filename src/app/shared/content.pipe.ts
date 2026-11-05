import { Pipe, PipeTransform } from '@angular/core';

/** `@if (text | hasContent)` → vrai si le texte est renseigné (non vide). */
@Pipe({ name: 'hasContent' })
export class HasContentPipe implements PipeTransform {
  transform(value: string | null | undefined): boolean {
    return !!value?.trim();
  }
}

/** `@for (x of list | withContent)` → retire les entrées vides d'une liste. */
@Pipe({ name: 'withContent' })
export class WithContentPipe implements PipeTransform {
  transform(values: readonly string[] | null | undefined): string[] {
    return (values ?? []).filter((v) => !!v.trim());
  }
}
