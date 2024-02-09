import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { baseUrl } from './global_config';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  constructor(private http: HttpClient) { }

  signInCustomer(lastName: string, firstName: string, contact: string, email: string, password: string) {
    const data = { lastName, firstName, contact, email, password };
    return this.http.post(baseUrl('/customers/signin'), data)
    .pipe(
      map((response: any) => {
        console.log('Réponse réussie :', response);
        return response;
      }),
      catchError((error) => {
        console.error('Erreur lors de la demande :', error);
        throw error;
      })
    );
  }
}
