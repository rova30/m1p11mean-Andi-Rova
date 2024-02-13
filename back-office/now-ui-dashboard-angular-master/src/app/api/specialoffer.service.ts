import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseUrl } from './global_api';

@Injectable({
  providedIn: 'root',
})
export class SpecialOfferService {
  constructor(private http: HttpClient) { }

  getSpecialOffers(page: number, pageSize: number): Observable<any[]> {
    const url = `${baseUrl('/specialOffers/allSpecialOffers')}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<any[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  totalSpecialOffersCount(): Observable<number> {
    return this.http.get<number>(`${baseUrl('/specialOffers/totalSpecialOffersCount')}`).pipe(
      catchError(this.handleError)
    );
  }
  
  
  addSpecialOffer(serviceData: any): Observable<any> {
    return this.http.post(baseUrl('/specialOffers/addSpecialOffer'), serviceData)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
