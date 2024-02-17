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

  getIncomesByMonth(): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl('/incomes/incomesByMonth')}`).pipe(
        catchError(this.handleError)
      );
  }

  // Changement de l'ordre des paramètres
  getIncomesByYearAndMonth(year: number, month: number): Observable<any[]> {
    // Concaténez l'année et le mois pour former l'URL de l'API
    return this.http.get<any[]>(`${baseUrl('/incomes/incomesByYearAndMonth/' + year + '/' + month)}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}

