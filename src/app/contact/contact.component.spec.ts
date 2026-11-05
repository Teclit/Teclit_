import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CONTACT_ENDPOINT } from '../core/contact/contact.service';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let fixture: ComponentFixture<ContactComponent>;
  let component: ContactComponent;
  let http: HttpTestingController;
  let el: HTMLElement;

  const fill = () =>
    component.form.setValue({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      subject: 'Mission',
      message: 'Bonjour, je souhaite échanger au sujet d’une mission.',
      website: '',
    });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('affiche les erreurs et n’envoie rien si le formulaire est invalide', () => {
    component.onSubmit();
    fixture.detectChanges();
    expect(el.querySelectorAll('[data-testid="field-error"]').length).toBe(3);
    expect(el.querySelector('#contact-email')?.getAttribute('aria-invalid')).toBe('true');
    http.expectNone(CONTACT_ENDPOINT);
  });

  it('envoie le message avec honeypot et horodatage, puis confirme', () => {
    fill();
    component.onSubmit();
    const req = http.expectOne(CONTACT_ENDPOINT);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.website).toBe('');
    expect(typeof req.request.body.startedAt).toBe('number');
    req.flush({ ok: true });
    fixture.detectChanges();
    expect(component.status()).toBe('sent');
    expect(el.querySelector('[role="status"]')?.textContent).toContain('bien été envoyé');
    expect(component.form.controls.name.value).toBe('');
  });

  it('affiche les erreurs de validation renvoyées par le serveur', () => {
    fill();
    component.onSubmit();
    http
      .expectOne(CONTACT_ENDPOINT)
      .flush({ errors: { email: 'Adresse email invalide.' } }, { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();
    expect(el.querySelector('#contact-email-error')?.textContent).toContain('Adresse email invalide.');
  });

  it('propose un repli par email en cas d’erreur serveur', () => {
    fill();
    component.onSubmit();
    http.expectOne(CONTACT_ENDPOINT).flush({}, { status: 503, statusText: 'Unavailable' });
    fixture.detectChanges();
    expect(component.status()).toBe('error');
    expect(el.querySelector('[data-testid="contact-status"] a')?.getAttribute('href')).toBe(
      'mailto:tewoldeteklit@gmail.com',
    );
  });

  it('associe chaque champ à un label', () => {
    for (const id of ['contact-name', 'contact-email', 'contact-subject', 'contact-message']) {
      expect(el.querySelector(`label[for="${id}"]`), id).not.toBeNull();
    }
  });
});
