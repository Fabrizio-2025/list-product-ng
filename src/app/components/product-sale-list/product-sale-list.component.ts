import { Component } from '@angular/core';
import { SaleDetailService } from '../../services/sale-detail.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-sale-list',
  templateUrl: './product-sale-list.component.html',
  styleUrl: './product-sale-list.component.css',
})
export class ProductSaleListComponent {
  saleIdInput: number | null = null;
  saleId: number | null = null;
  products: Product[] = [];
  totalPrice: number | null = null;

  constructor(private saleDetailService: SaleDetailService) {}

  loadProducts(): void {
    if (this.saleIdInput !== null) {
      this.saleId = this.saleIdInput;
      this.saleDetailService
        .getProductsBySaleId(this.saleId)
        .subscribe((data: Product[]) => {
          this.products = data;
        });
      this.saleDetailService
        .getTotalPriceBySaleId(this.saleId)
        .subscribe((price: number) => {
          this.totalPrice = price;
        });
    }
  }
}
