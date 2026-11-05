import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'icon';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold leading-tight no-underline select-none ' +
  'transition-transform duration-200 ease-out-expo motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 ' +
  'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-fg shadow-card hover:bg-accent-strong',
  secondary: 'border border-border bg-surface text-fg hover:border-accent hover:text-accent',
  ghost: 'text-fg hover:bg-surface-2 hover:text-accent',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-4 text-sm',
  md: 'min-h-11 px-5 text-sm sm:text-base',
  icon: 'size-11 shrink-0',
};

/** Bouton / lien du design system : `<a appButton>` ou `<button appButton>`. */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector -- composant attribut, garde la sémantique native a/button
  selector: 'a[appButton], button[appButton]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: '<ng-content />',
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  protected readonly classes = computed(() => `${BASE} ${VARIANTS[this.variant()]} ${SIZES[this.size()]}`);
}
