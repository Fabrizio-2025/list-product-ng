import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-brand-chart',
  templateUrl: './product-brand-chart.component.html',
  styleUrls: ['./product-brand-chart.component.css'],
})
export class ProductBrandChartComponent implements OnInit {
  products: Product[] = [];
  productsByBrand: { [key: string]: number } = {};
  chartData: any;
  top4Products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadTop4Products();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
      this.calculateProductsByBrand();
      this.prepareChartData();
    });
  }

  calculateProductsByBrand(): void {
    this.productsByBrand = this.products.reduce(
      (acc: { [key: string]: number }, product: Product) => {
        if (product.brand) {
          acc[product.brand] = (acc[product.brand] || 0) + 1;
        }
        return acc;
      },
      {}
    );
  }

  prepareChartData(): void {
    const brands = Object.keys(this.productsByBrand);
    const counts = Object.values(this.productsByBrand);

    this.chartData = {
      labels: brands,
      datasets: [
        {
          data: counts,
          backgroundColor: this.getChartColors(brands.length),
          hoverBackgroundColor: this.getChartColors(brands.length),
        },
      ],
    };
  }

  getChartColors(count: number): string[] {
    const colors = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#FF9F40',
      '#4BC0C0',
      '#9966FF',
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#FF9F40',
      '#4BC0C0',
      '#9966FF',
    ];
    return colors.slice(0, count);
  }

  loadTop4Products(): void {
    this.productService
      .getTop4MostPurchasedProducts()
      .subscribe((data: Product[]) => {
        this.top4Products = data;
      });
  }
}
