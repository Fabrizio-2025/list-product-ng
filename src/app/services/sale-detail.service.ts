import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SaleDetail } from '../models/sale-detail.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class SaleDetailService {
  private apiUrl = 'http://localhost:3000/sale-details';

  constructor(private http: HttpClient) {}

  addSaleDetail(saleDetail: SaleDetail): Observable<SaleDetail> {
    return this.http.post<SaleDetail>(this.apiUrl, saleDetail);
  }
  getProductsBySaleId(saleId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/sale/${saleId}`);
  }

  getTotalPriceBySaleId(saleId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/sale/${saleId}/total-price`);
  }
  createSaleWithDetails(sale: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sales/create-with-details`, sale);
  }
  
}
