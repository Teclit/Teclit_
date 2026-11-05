import { Pipe, PipeTransform } from '@angular/core';
import { isTodo } from '../data/profile.utils';

/** `{{ value | isTodo }}` → vrai si la valeur est un placeholder `TODO:` à compléter. */
@Pipe({ name: 'isTodo' })
export class IsTodoPipe implements PipeTransform {
  transform(value: string | null | undefined): boolean {
    return isTodo(value);
  }
}
