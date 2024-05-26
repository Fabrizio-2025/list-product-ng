import { Component } from '@angular/core';
import { SaleService } from '../../services/sale.service';
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

  constructor(private saleService: SaleService) {}

  loadProducts(): void {
    if (this.saleIdInput !== null) {
      this.saleId = this.saleIdInput;
      this.saleService
        .getProductsBySaleId(this.saleId)
        .subscribe((data: Product[]) => {
          this.products = data;
        });
      this.saleService
        .getTotalPriceBySaleId(this.saleId)
        .subscribe((price: number) => {
          this.totalPrice = price;
        });
    }
  }
}
