import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content/content.service';
import {
  CONTACT_LIMITS,
  type ContactErrors,
  type ContactField,
  contactFieldError,
} from '../core/contact/contact.schema';
import { ContactService } from '../core/contact/contact.service';
import { IconComponent } from '../shared/icon/icon.component';
import { ButtonComponent } from '../shared/ui/button.component';
import { HydratedDirective } from '../shared/hydrated.directive';
import { CardComponent } from '../shared/ui/card.component';

export type ContactStatus = 'idle' | 'sending' | 'sent' | 'error';

/** Validateur Angular adossé au schéma Zod partagé avec le serveur. */
function zodValidator(field: ContactField): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const message = contactFieldError(field, control.value ?? '');
    return message ? { schema: message } : null;
  };
}

const FIELD =
  'block w-full rounded-xl border bg-bg px-4 py-3 text-fg placeholder:text-muted/70 focus:outline-3 focus:outline-offset-1 focus:outline-accent';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, RouterLink, IconComponent, ButtonComponent, CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [HydratedDirective],
  host: { class: 'block' },
  template: `
    <div class="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <ul role="list" class="space-y-4">
          <li class="flex items-center gap-3">
            <span class="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent-strong dark:text-accent"
              ><app-icon name="mail" [size]="18"
            /></span>
            <a [href]="'mailto:' + identity.links.email" class="font-medium text-fg hover:text-accent">{{
              identity.links.email
            }}</a>
          </li>
          <li class="flex items-center gap-3">
            <span class="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent-strong dark:text-accent"
              ><app-icon name="phone" [size]="18"
            /></span>
            <a [href]="phoneHref" class="font-medium text-fg hover:text-accent">{{ identity.phone }}</a>
          </li>
          <li class="flex items-center gap-3">
            <span class="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent-strong dark:text-accent"
              ><app-icon name="map-pin" [size]="18"
            /></span>
            <span>{{ identity.location }}</span>
          </li>
        </ul>
        <div class="mt-8 flex flex-wrap gap-3">
          <a appButton variant="secondary" routerLink="/cv"
            ><app-icon name="download" [size]="18" /> Télécharger le CV</a
          >
          <a
            appButton
            variant="secondary"
            size="icon"
            [href]="identity.links.linkedin"
            target="_blank"
            rel="noopener noreferrer"
          >
            <app-icon name="linkedin" /><span class="sr-only">LinkedIn (nouvel onglet)</span>
          </a>
          <a
            appButton
            variant="secondary"
            size="icon"
            [href]="identity.links.github"
            target="_blank"
            rel="noopener noreferrer"
          >
            <app-icon name="github" /><span class="sr-only">GitHub (nouvel onglet)</span>
          </a>
        </div>
      </div>

      <form
        appCard
        class="grid gap-5"
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        novalidate
        aria-label="Formulaire de contact"
      >
        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label for="contact-name" class="mb-1.5 block text-sm font-semibold"
              >Nom <span aria-hidden="true" class="text-danger">*</span></label
            >
            <input
              id="contact-name"
              type="text"
              formControlName="name"
              autocomplete="name"
              required
              [class]="fieldClass('name')"
              [attr.aria-invalid]="showError('name')"
              [attr.aria-describedby]="showError('name') ? 'contact-name-error' : null"
            />
            @if (showError('name')) {
              <p id="contact-name-error" class="mt-1.5 text-sm text-danger" data-testid="field-error">
                {{ errorFor('name') }}
              </p>
            }
          </div>
          <div>
            <label for="contact-email" class="mb-1.5 block text-sm font-semibold"
              >Email <span aria-hidden="true" class="text-danger">*</span></label
            >
            <input
              id="contact-email"
              type="email"
              formControlName="email"
              autocomplete="email"
              required
              [class]="fieldClass('email')"
              [attr.aria-invalid]="showError('email')"
              [attr.aria-describedby]="showError('email') ? 'contact-email-error' : null"
            />
            @if (showError('email')) {
              <p id="contact-email-error" class="mt-1.5 text-sm text-danger" data-testid="field-error">
                {{ errorFor('email') }}
              </p>
            }
          </div>
        </div>

        <div>
          <label for="contact-subject" class="mb-1.5 block text-sm font-semibold">Sujet</label>
          <input
            id="contact-subject"
            type="text"
            formControlName="subject"
            [class]="fieldClass('subject')"
            [attr.aria-invalid]="showError('subject')"
            [attr.aria-describedby]="showError('subject') ? 'contact-subject-error' : null"
          />
          @if (showError('subject')) {
            <p id="contact-subject-error" class="mt-1.5 text-sm text-danger" data-testid="field-error">
              {{ errorFor('subject') }}
            </p>
          }
        </div>

        <div>
          <label for="contact-message" class="mb-1.5 block text-sm font-semibold"
            >Message <span aria-hidden="true" class="text-danger">*</span></label
          >
          <textarea
            id="contact-message"
            rows="6"
            formControlName="message"
            required
            [class]="fieldClass('message')"
            [attr.aria-invalid]="showError('message')"
            [attr.aria-describedby]="
              showError('message') ? 'contact-message-hint contact-message-error' : 'contact-message-hint'
            "
          ></textarea>
          <p id="contact-message-hint" class="mt-1.5 text-sm text-muted">
            Entre {{ limits.messageMin }} et {{ limits.messageMax }} caractères.
          </p>
          @if (showError('message')) {
            <p id="contact-message-error" class="mt-1 text-sm text-danger" data-testid="field-error">
              {{ errorFor('message') }}
            </p>
          }
        </div>

        <!-- Honeypot anti-spam : masqué aux humains et aux technologies d'assistance -->
        <div class="absolute -left-[9999px] size-px overflow-hidden" aria-hidden="true">
          <label for="contact-website">Ne pas remplir ce champ</label>
          <input id="contact-website" type="text" formControlName="website" tabindex="-1" autocomplete="off" />
        </div>

        <div class="flex flex-wrap items-center justify-between gap-4">
          <p class="text-sm text-muted"><span aria-hidden="true" class="text-danger">*</span> Champs obligatoires.</p>
          <button appButton type="submit" [disabled]="status() === 'sending'">
            <app-icon name="mail" [size]="18" />
            {{ status() === 'sending' ? 'Envoi en cours…' : 'Envoyer le message' }}
          </button>
        </div>

        <div role="status" aria-live="polite" data-testid="contact-status">
          @if (status() === 'sent') {
            <p class="rounded-xl bg-success/10 px-4 py-3 font-medium text-success">
              Merci ! Votre message a bien été envoyé.
            </p>
          }
          @if (status() === 'error') {
            <p class="rounded-xl bg-danger/10 px-4 py-3 text-danger">
              {{ errorMessage() }}
              <a [href]="'mailto:' + identity.links.email" class="font-semibold underline">{{
                identity.links.email
              }}</a>
            </p>
          }
        </div>
      </form>
    </div>
  `,
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contact = inject(ContactService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly identity = inject(ContentService).identity;
  protected readonly limits = CONTACT_LIMITS;
  /** `06 95 …` → `tel:+33695…` */
  protected readonly phoneHref = `tel:+33${this.identity.phone.replace(/\s/g, '').replace(/^0/, '')}`;

  readonly status = signal<ContactStatus>('idle');
  readonly errorMessage = signal('');
  readonly serverErrors = signal<ContactErrors>({});
  readonly submitted = signal(false);

  /** Horodatage d'affichage du formulaire (anti-spam, vérifié côté serveur). */
  private startedAt = Date.now();

  readonly form = this.fb.nonNullable.group({
    name: ['', zodValidator('name')],
    email: ['', zodValidator('email')],
    subject: ['', zodValidator('subject')],
    message: ['', zodValidator('message')],
    /** Honeypot : invisible pour les humains, doit rester vide. */
    website: [''],
  });

  protected showError(field: ContactField): boolean {
    const control = this.form.controls[field];
    return (control.invalid && (control.touched || this.submitted())) || !!this.serverErrors()[field];
  }

  protected errorFor(field: ContactField): string {
    return this.serverErrors()[field] ?? (this.form.controls[field].errors?.['schema'] as string | undefined) ?? '';
  }

  protected fieldClass(field: ContactField): string {
    return `${FIELD} ${this.showError(field) ? 'border-danger' : 'border-border'}`;
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.serverErrors.set({});
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.status.set('sending');
    this.contact
      .send({ ...this.form.getRawValue(), startedAt: this.startedAt })
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
