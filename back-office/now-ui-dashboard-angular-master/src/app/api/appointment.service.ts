import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseUrl } from './global_api';

@Injectable({
    providedIn: 'root'
  })
  export class AppointmentService {
  
    constructor(private http: HttpClient) { }
  
    getAppointmentsByMonth(year: number): Observable<any[]> {
      return this.http.get<any[]>(`${baseUrl('/appointments/appointmentsByMonth/' + year)}`).pipe(
        catchError(this.handleError)
      );
    }
  
    getAppointmentsByYearAndMonth(year: number, month: number): Observable<any[]> {
      return this.http.get<any[]>(`${baseUrl('/appointments/appointmentsByYearAndMonth/' + year + '/' + month)}`).pipe(
        catchError(this.handleError)
      );
    }
  
    private handleError(error: any) {
      console.error('An error occurred:', error);
      return throwError(error);
    }
  }
  