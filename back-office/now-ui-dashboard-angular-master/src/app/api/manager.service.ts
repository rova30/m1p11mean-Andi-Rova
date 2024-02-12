import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseUrl } from './global_api';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  constructor(private http: HttpClient) { }

  loginManager(loginData: any): Observable<any> {
    return this.http.post(baseUrl('/managers/loginManager'), loginData)
      .pipe(
        catchError(this.handleError)
    );
  }

  getManagerByToken(token: any): Observable<any> {
    const params = new HttpParams().set('token', token);
  
    return this.http.get(baseUrl('/managers/token'), { params })
      .pipe(
        catchError(this.handleError)
      );
  }
  
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
