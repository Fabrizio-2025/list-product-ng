import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// PrimeNG modules
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ChartModule } from 'primeng/chart';

// components
import { ProductListComponent } from './components/product-list/product-list.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductBrandChartComponent } from './components/product-brand-chart/product-brand-chart.component';
import { ProductSaleListComponent } from './components/product-sale-list/product-sale-list.component';

@NgModule({
  declarations: [AppComponent, ProductListComponent , ProductBrandChartComponent, ProductSaleListComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    // PrimeNG modules
    SidebarModule,
    ButtonModule,
    RippleModule,
    AvatarModule,
    StyleClassModule,
    ToolbarModule,
    TableModule,
    ConfirmDialogModule,
    ToastModule,
    DropdownModule,
    InputTextModule,
    DialogModule,
    ChartModule,
  ],
  providers: [
    ConfirmationService,
    MessageService, // Asegúrate de que MessageService esté en los proveedores
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
