import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseUrl } from './global_api';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) { }

  getEmployees(page: number, pageSize: number): Observable<any[]> {
    const url = `${baseUrl('/employees/allEmployees')}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<any[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  totalEmployeesCount(): Observable<number> {
    return this.http.get<number>(`${baseUrl('/employees/totalEmployeesCount')}`).pipe(
      catchError(this.handleError)
    );
  }
  
  
  addEmployee(employeeData: any): Observable<any> {
    return this.http.post(baseUrl('/employees/addEmployee'), employeeData)
      .pipe(
        catchError(this.handleError)
      );
  }

  loginEmployee(loginData: any): Observable<any> {
    return this.http.post(baseUrl('/employees/loginEmployee'), loginData)
      .pipe(
        catchError(this.handleError)
    );
  }

  getEmployeeByToken(token: any): Observable<any> {
    const params = new HttpParams().set('token', token);
  
    return this.http.get(baseUrl('/employees/token'), { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  infoByEmployee(employeeId:string): Observable<any> {
    return this.http.get<any[]>(`${baseUrl('/employees/infoByEmployee/' + employeeId )}`).pipe(
      catchError(this.handleError)
    );
  }


  addSpeciality(employeeId: string, speciality: any): Observable<any> {
    return this.http.put<any>(`${baseUrl('/employees/addSpeciality/' + employeeId )}`, speciality).pipe(
      catchError(this.handleError)
    );
  }  
  
  checkSpecialityExistence(employeeId: string, specialityId: string): Observable<any> {
    return this.http.get<any>(`${baseUrl('/employees/checkSpecialityExistence/' + employeeId + '/' + specialityId )}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteSpeciality(employeeId: string, specialityId: string): Observable<any> {
    return this.http.delete<any>(`${baseUrl('/employees/deleteSpeciality/' + employeeId + '/' + specialityId )}`).pipe(
      catchError(this.handleError)
    );
  }

  

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
