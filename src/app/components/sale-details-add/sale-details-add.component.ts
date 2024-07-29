import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { SaleService } from '../../services/sale.service';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../services/product.service';
import { ImagenService } from '../../services/imagen.service';
import { Product } from '../../models/product.model';
import { SaleWithDetails } from '../../models/sale-with-details.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sale-details-add',
  templateUrl: './sale-details-add.component.html',
  styleUrls: ['./sale-details-add.component.css'],
  providers: [MessageService],
})
export class SaleDetailsAddComponent implements OnInit {
  saleForm: FormGroup;
  products: Product[] = [];
  nextSaleNumber: number | undefined;

  constructor(
    private fb: FormBuilder,
    private saleService: SaleService,
    private messageService: MessageService,
    private productService: ProductService,
    private imagenService: ImagenService,
    private sanitizer: DomSanitizer
  ) {
    this.saleForm = this.fb.group({
      date: ['', Validators.required],
      saleDetails: this.fb.array([]),
    });
    this.addSaleDetail();
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadNextSaleNumber();
  }

  get saleDetails(): FormArray {
    return this.saleForm.get('saleDetails') as FormArray;
  }

  addSaleDetail(): void {
    const saleDetailGroup = this.fb.group({
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
    });
    this.saleDetails.push(saleDetailGroup);
  }

  removeSaleDetail(index: number): void {
    this.saleDetails.removeAt(index);
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (products) => {
        const productObservables = products.map((product) =>
          this.imagenService.getImage(product.id).pipe(
            map((imageBlob) => {
              const objectURL = URL.createObjectURL(imageBlob);
              product.imageUrl =
                this.sanitizer.bypassSecurityTrustUrl(objectURL);
              return product;
            })
          )
        );

        forkJoin(productObservables).subscribe(
          (productsWithImages: Product[]) => {
            this.products = productsWithImages;
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to load product images',
            });
          }
        );
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load products',
        });
      }
    );
  }

  loadNextSaleNumber(): void {
    this.saleService.getSaleCount().subscribe(
      (response) => {
        this.nextSaleNumber = response.count + 1;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load next sale number',
        });
      }
    );
  }

  submitSale(): void {
    if (this.saleForm.valid) {
      const saleData: SaleWithDetails = this.saleForm.value;
      this.saleService.createSaleWithDetails(saleData).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Created',
            detail: 'Sale created successfully',
          });
          this.saleForm.reset();
          while (this.saleDetails.length) {
            this.saleDetails.removeAt(0);
          }
          this.addSaleDetail(); // Ensure at least one sale detail row is present
          this.loadNextSaleNumber(); // Update the next sale number
        },
        (error) => {
          if (error.status === 400) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.error || 'Check sale details',
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create sale',
            });
            console.log(saleData);
          }
        }
      );
    }
  }
}
