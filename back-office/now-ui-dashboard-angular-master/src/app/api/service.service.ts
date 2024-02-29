import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseUrl } from './global_api';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  constructor(private http: HttpClient) { }

  getServices(page: number, pageSize: number): Observable<any[]> {
    const url = `${baseUrl('/services/allServices')}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<any[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  totalServicesCount(): Observable<number> {
    return this.http.get<number>(`${baseUrl('/services/totalServicesCount')}`).pipe(
      catchError(this.handleError)
    );
  }
  
  
  addService(serviceData: any): Observable<any> {
    return this.http.post(baseUrl('/services/addService'), serviceData)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateService(serviceId: string, serviceData: any): Observable<any> {
    const url = `${baseUrl('/services/service')}/${serviceId}`; // Retirez la barre oblique après '/service'
    return this.http.put(url, serviceData)
      .pipe(
        catchError(this.handleError)
      );
  }
  

  getServicesdetail(id: String): Observable<any[]> {
    const url = `${baseUrl('/services/service/'+ id)}`;
    return this.http.get<any[]>(url).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
