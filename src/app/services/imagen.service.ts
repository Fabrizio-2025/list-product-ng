import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductImage } from '../models/product-image';

@Injectable({
  providedIn: 'root',
})
export class ImagenService {
  private baseUrl = 'http://localhost:3000/imagenes';

  constructor(private http: HttpClient) {}

  uploadImage(productId: number, file: File): Observable<ProductImage> {
    const formData: FormData = new FormData();
    formData.append('productId', productId.toString());
    formData.append('file', file, file.name);
    return this.http.post<ProductImage>(`${this.baseUrl}/upload`, formData);
  }
  
  updateImage(productId: number, file: File): Observable<ProductImage> {
    const formData: FormData = new FormData();
    formData.append('productId', productId.toString());
    formData.append('file', file, file.name);
    return this.http.put<ProductImage>(`${this.baseUrl}/update`, formData);
  }

  getImage(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/media/${id}`, {
      responseType: 'blob',
    });
  }
}
