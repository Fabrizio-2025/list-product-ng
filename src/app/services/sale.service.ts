import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private apiUrl = 'http://localhost:3000/sale-details';

  constructor(private http: HttpClient) {}

  getProductsBySaleId(saleId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/sale/${saleId}`);
  }

  getTotalPriceBySaleId(saleId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/sale/${saleId}/total-price`);
  }
  
}
