import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseUrl } from './global_api';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  constructor(private http: HttpClient) { }

  getIncomesByMonth(year: number): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl('/incomes/incomesByMonth/' + year)}`).pipe(
        catchError(this.handleError)
      );
  }

  getIncomesByYearAndMonth(year: number, month: number): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl('/incomes/incomesByYearAndMonth/' + year + '/' + month)}`).pipe(
      catchError(this.handleError)
    );
  }

  getIncomesDetailsByYearAndMonth(year: number, month: number): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl('/incomes/incomesDetailsByYearAndMonth/' + year + '/' + month)}`).pipe(
      catchError(this.handleError)
    );
  }

  getIncomesCategory(page: number, pageSize: number): Observable<any[]> {
    const url = `${baseUrl('/incomes/allIncomesCategory')}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<any[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  totalIncomesCategoryCount(): Observable<number> {
    return this.http.get<number>(`${baseUrl('/incomes/totalIncomesCategoryCount')}`).pipe(
      catchError(this.handleError)
    );
  }
  
  
  addIncomeCategory(employeeData: any): Observable<any> {
    return this.http.post(baseUrl('/incomes/addIncomeCategory'), employeeData)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}

