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
  barChartData: any;
  barChartOptions: any;

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
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(this.getRandomColor());
    }
    return colors;
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  loadTop4Products(): void {
    this.productService
      .getTop4MostPurchasedProducts()
      .subscribe((data: Product[]) => {
        this.top4Products = data;
        this.prepareBarChartData();
      });
  }

  prepareBarChartData(): void {
    const productNames = this.top4Products.map((product) => product.name);
    const productQuantities = this.top4Products.map(
      (product) => product['totalQuantity']
    );

    this.barChartData = {
      labels: productNames,
      datasets: [
        {
          label: 'Top 4 Most Purchased Products',
          backgroundColor: this.getChartColors(productNames.length),
          borderColor: this.getChartColors(productNames.length),
          data: productQuantities,
        },
      ],
    };

    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem: any) {
              return tooltipItem.label + ': ' + tooltipItem.raw;
            },
          },
        },
      },
    };
  }
}
