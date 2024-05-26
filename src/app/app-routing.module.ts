import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductBrandChartComponent } from './components/product-brand-chart/product-brand-chart.component';
import { ProductSaleListComponent } from './components/product-sale-list/product-sale-list.component';


const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'products-by-brand', component: ProductBrandChartComponent },
  { path: 'products-by-sale', component: ProductSaleListComponent },
  { path: '**', redirectTo: '/products' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
