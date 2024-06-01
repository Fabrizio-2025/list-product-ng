import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SaleWithDetails } from '../models/sale-with-details.model';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private apiUrl = 'http://localhost:3000/sales';

  constructor(private http: HttpClient) { }

  createSaleWithDetails(saleData: SaleWithDetails): Observable<SaleWithDetails> {
    return this.http.post<SaleWithDetails>(`${this.apiUrl}/create-with-details`,saleData);
  }
}
