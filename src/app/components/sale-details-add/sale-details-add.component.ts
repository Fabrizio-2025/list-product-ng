import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SaleDetailService } from '../../services/sale-detail.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sale-details-add',
  templateUrl: './sale-details-add.component.html',
  styleUrl: './sale-details-add.component.css',
})
export class SaleDetailsAddComponent {
  saleDetailForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private saleDetailService: SaleDetailService,
    private messageService: MessageService
  ) {
    this.saleDetailForm = this.fb.group({
      saleId: ['', Validators.required],
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
    });
  }

  addSaleDetail(): void {
    if (this.saleDetailForm.valid) {
      this.saleDetailService.addSaleDetail(this.saleDetailForm.value).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Sale detail added successfully',
          });
          this.saleDetailForm.reset();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add sale detail',
          });
        }
      );
    }
  }
}
