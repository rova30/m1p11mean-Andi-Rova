import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseUrl } from './global_api';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) { }

  getCustomers(page: number, pageSize: number): Observable<any[]> {
    const url = `${baseUrl('/customers/allCustomers')}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<any[]>(url).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
