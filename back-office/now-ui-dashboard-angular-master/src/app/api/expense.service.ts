import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseUrl } from './global_api';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private http: HttpClient) { }

  getExpensesByMonth(year: number): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl('/expenses/expensesByMonth/' + year)}`).pipe(
        catchError(this.handleError)
      );
  }


  getExpensesCategory(page: number, pageSize: number): Observable<any[]> {
    const url = `${baseUrl('/expenses/allExpensesCategory')}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<any[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  totalExpensesCategoryCount(): Observable<number> {
    return this.http.get<number>(`${baseUrl('/expenses/totalExpensesCategoryCount')}`).pipe(
      catchError(this.handleError)
    );
  }
  
  
  addExpenseCategory(employeeData: any): Observable<any> {
    return this.http.post(baseUrl('/expenses/addExpenseCategory'), employeeData)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}

