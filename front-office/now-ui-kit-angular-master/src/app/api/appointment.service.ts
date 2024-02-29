import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseUrl } from './global_config';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  constructor(private http: HttpClient) { }

  getAvailableDate(deadline: number): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl('/appointments/getAvalaibleDate/'+deadline)}`).pipe(
        catchError(this.handleError)
      );
  }

  
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
