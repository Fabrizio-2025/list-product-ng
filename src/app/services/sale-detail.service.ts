import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SaleDetail } from '../models/sale-detail.model';

@Injectable({
  providedIn: 'root',
})
export class SaleDetailService {
  private apiUrl = 'http://localhost:3000/sale-details';

  constructor(private http: HttpClient) {}

  addSaleDetail(saleDetail: SaleDetail): Observable<SaleDetail> {
    return this.http.post<SaleDetail>(this.apiUrl, saleDetail);
  }
}
