import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ImagenService } from '../../services/imagen.service';
import { Product } from '../../models/product.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  editDialogVisible = false;
  createDialogVisible = false;
  editForm: FormGroup;
  createForm: FormGroup;
  currentProduct: Product | null = null;
  selectedFile: File | null = null;
  uploadedFiles: any[] = [];
  searchValue: string = '';
  selectedSearchAttribute = { label: 'ID', value: 'id' };
  searchAttributes = [
    { label: 'ID', value: 'id' },
    { label: 'Name', value: 'name' },
    { label: 'Description', value: 'description' },
    { label: 'Brand', value: 'brand' },
    { label: 'Price', value: 'price' },
  ];

  constructor(
    private productService: ProductService,
    private imagenService: ImagenService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      brand: ['', Validators.required],
      price: [
        '',
        [Validators.required, Validators.min(0), Validators.max(1000)],
      ],
    });

    this.createForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      brand: ['', Validators.required],
      price: [
        '',
        [Validators.required, Validators.min(0), Validators.max(1000)],
      ],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
      this.filteredProducts = data; // Initialize filteredProducts with all products
      this.products.forEach((product) => {
        this.loadImage(product.id);
      });
    });
  }

  loadImage(productId: number): void {
    this.imagenService.getImage(productId).subscribe((imageBlob) => {
      const objectURL = URL.createObjectURL(imageBlob);
      const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      const product = this.products.find((p) => p.id === productId);
      if (product) {
        product.imageUrl = sanitizedUrl;
      }
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

  onImageUpload(event: any): void {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
      this.selectedFile = file;
    }
    this.messageService.add({
      severity: 'info',
      summary: 'File Uploaded',
      detail: '',
    });
  }

  updateProduct(): void {
    if (this.editForm.valid && this.currentProduct) {
      const updatedProduct = { ...this.currentProduct, ...this.editForm.value };
      this.productService.updateProduct(updatedProduct).subscribe(
        () => {
          if (this.selectedFile && this.currentProduct) {
            this.imagenService
              .updateImage(this.currentProduct.id, this.selectedFile)
              .subscribe(
                () => {
                  this.loadProducts();
                  this.editDialogVisible = false;
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Updated',
                    detail: 'Product updated successfully',
                  });
                },
                (error) => {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to upload image',
                  });
                }
              );
          } else {
            this.loadProducts();
            this.editDialogVisible = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Updated',
              detail: 'Product updated successfully',
            });
          }
        },
        (error) => {
          if (error.status === 400) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Duplicate product details',
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update product',
            });
          }
        }
      );
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
      this.productService.addProduct(newProduct).subscribe(
        () => {
          this.loadProducts();
          this.createDialogVisible = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Created',
            detail: 'Product added successfully',
          });
        },
        (error) => {
          if (error.status === 400) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Check product details',
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to add product',
            });
          }
        }
      );
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

  filterProducts(): void {
    const searchValueLower = this.searchValue.toLowerCase();
    this.filteredProducts = this.products.filter((product) => {
      return product[this.selectedSearchAttribute.value]
        ?.toString()
        .toLowerCase()
        .includes(searchValueLower);
    });
  }
}
