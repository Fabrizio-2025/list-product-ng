import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  editDialogVisible = false;
  createDialogVisible = false;
  editForm: FormGroup;
  createForm: FormGroup;
  currentProduct: Product | null = null;

  constructor(
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
    });

    this.createForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
    });
  }

  openEditDialog(product: Product): void {
    this.currentProduct = product;
    this.editForm.patchValue(product);
    this.editDialogVisible = true;
  }

  cancelEdit(): void {
    this.editDialogVisible = false;
    this.messageService.add({
      severity: 'warn',
      summary: 'Cancelled',
      detail: 'Edit cancelled',
    });
  }

  updateProduct(): void {
    if (this.editForm.valid && this.currentProduct) {
      const updatedProduct = { ...this.currentProduct, ...this.editForm.value };
      this.productService.updateProduct(updatedProduct).subscribe(() => {
        this.loadProducts();
        this.editDialogVisible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Product updated successfully',
        });
      });
    }
  }

  openCreateDialog(): void {
    this.createForm.reset();
    this.createDialogVisible = true;
  }

  cancelCreate(): void {
    this.createDialogVisible = false;
    this.messageService.add({
      severity: 'warn',
      summary: 'Cancelled',
      detail: 'Creation cancelled',
    });
  }

  addProduct(): void {
    if (this.createForm.valid) {
      const newProduct = this.createForm.value as Product;
      this.productService.addProduct(newProduct).subscribe(() => {
        this.loadProducts();
        this.createDialogVisible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Created',
          detail: 'Product added successfully',
        });
      });
    }
  }

  confirmDelete(productId: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteProduct(productId);
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelled',
          detail: 'Delete cancelled',
        });
      },
    });
  }

  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId).subscribe(() => {
      this.loadProducts();
      this.messageService.add({
        severity: 'success',
        summary: 'Deleted',
        detail: 'Product deleted successfully',
      });
    });
  }
}
