import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CONTACT_LIMITS, ContactField, isValidEmail } from '../core/contact/contact-validation';
import { ContactService } from '../core/contact/contact.service';
import { PROFILE } from '../data/profile.data';
import { IconComponent } from '../shared/icon/icon.component';
import { RevealDirective } from '../shared/reveal.directive';

export type ContactStatus = 'idle' | 'sending' | 'sent' | 'error';

function emailValidator(control: AbstractControl<string>): ValidationErrors | null {
  const value = (control.value ?? '').trim();
  return value === '' || isValidEmail(value) ? null : { email: true };
}

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, IconComponent, RevealDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contact = inject(ContactService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly identity = PROFILE.identity;
  protected readonly limits = CONTACT_LIMITS;
  /** `06 95 …` → `tel:+33695…` */
  protected readonly phoneHref = `tel:+33${PROFILE.identity.phone.replace(/\s/g, '').replace(/^0/, '')}`;
  readonly status = signal<ContactStatus>('idle');
  readonly errorMessage = signal('');
  readonly serverErrors = signal<Partial<Record<ContactField, string>>>({});
  readonly submitted = signal(false);

  /** Horodatage d'affichage du formulaire (anti-spam, vérifié côté serveur). */
  private startedAt = Date.now();

  readonly form = this.fb.nonNullable.group({
    name: [
      '',
      [Validators.required, Validators.minLength(CONTACT_LIMITS.nameMin), Validators.maxLength(CONTACT_LIMITS.nameMax)],
    ],
    email: ['', [Validators.required, emailValidator]],
    subject: ['', [Validators.maxLength(CONTACT_LIMITS.subjectMax)]],
    message: [
      '',
      [
        Validators.required,
        Validators.minLength(CONTACT_LIMITS.messageMin),
        Validators.maxLength(CONTACT_LIMITS.messageMax),
      ],
    ],
    /** Honeypot : invisible pour les humains, doit rester vide. */
    website: [''],
  });

  protected showError(field: ContactField): boolean {
    const control = this.form.controls[field];
    return (control.invalid && (control.touched || this.submitted())) || !!this.serverErrors()[field];
  }

  protected errorFor(field: ContactField): string {
    const server = this.serverErrors()[field];
    if (server) return server;
    const errors = this.form.controls[field].errors ?? {};
    if (errors['required']) return 'Ce champ est obligatoire.';
    if (errors['email']) return 'Adresse email invalide.';
    if (errors['minlength']) return `Au moins ${errors['minlength'].requiredLength} caractères.`;
    if (errors['maxlength']) return `Au plus ${errors['maxlength'].requiredLength} caractères.`;
    return '';
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.serverErrors.set({});
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.status.set('sending');
    const value = this.form.getRawValue();
    this.contact
      .send({ ...value, startedAt: this.startedAt })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        switch (result.status) {
          case 'sent':
            this.status.set('sent');
            this.form.reset();
            this.submitted.set(false);
            this.startedAt = Date.now();
            break;
          case 'invalid':
            this.serverErrors.set(result.errors);
            this.status.set('idle');
            break;
          case 'error':
            this.errorMessage.set(result.message);
            this.status.set('error');
            break;
        }
      });
  }
}
