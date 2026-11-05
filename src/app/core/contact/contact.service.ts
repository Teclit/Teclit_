import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import type { ContactErrors, ContactPayload } from './contact.schema';

export const CONTACT_ENDPOINT = '/api/contact';

export type ContactSendResult =
  { status: 'sent' } | { status: 'invalid'; errors: ContactErrors } | { status: 'error'; message: string };

interface ContactApiError {
  error?: string;
  errors?: ContactErrors;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);

  send(payload: ContactPayload): Observable<ContactSendResult> {
    return this.http.post<unknown>(CONTACT_ENDPOINT, payload).pipe(
      map((): ContactSendResult => ({ status: 'sent' })),
      catchError((err: HttpErrorResponse) => {
        const body = (err.error ?? {}) as ContactApiError;
        if (err.status === 400 && body.errors) {
          return of<ContactSendResult>({ status: 'invalid', errors: body.errors });
        }
        if (err.status === 429) {
          return of<ContactSendResult>({
            status: 'error',
            message: 'Trop de messages envoyés. Merci de réessayer dans quelques minutes.',
          });
        }
        return of<ContactSendResult>({
          status: 'error',
          message: "Le message n'a pas pu être envoyé. Vous pouvez m'écrire directement par email.",
        });
      }),
    );
  }
}
