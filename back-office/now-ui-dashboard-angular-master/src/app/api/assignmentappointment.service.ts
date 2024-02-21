// assignmentappointment.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseUrl } from './global_api';

@Injectable({
  providedIn: 'root'
})
export class AssignmentAppointmentService {

  constructor(private http: HttpClient) { }

  getassignmentByEmployee(employeeId: string, date: string, statut: number): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl('/assignmentAppointment/appointmentsByEmployeeAndDateAndStatus/' + employeeId + '/' + date + '/' + statut)}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
