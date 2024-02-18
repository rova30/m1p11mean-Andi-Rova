import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { baseUrl } from './global_config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) { }

  signInCustomer(lastName: string, firstName: string, contact: string, email: string, password: string, fcmToken: string) {
    const data = { lastName, firstName, contact, email, password, fcmToken };
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

  loginCustomer(loginData: any): Observable<any> {
    return this.http.post(baseUrl('/customers/loginCustomer'), loginData)
      .pipe(
        catchError(this.handleError)
    );
  }

  getCustomerByToken(token: any): Observable<any> {
    const params = new HttpParams().set('token', token);
  
    return this.http.get(baseUrl('/customers/token'), { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
