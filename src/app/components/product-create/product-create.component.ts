import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
})
export class ProductCreateComponent implements OnInit {
  productForm: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      brand: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.productForm.valid) {
      this.productService
        .createProduct(this.productForm.value)
        .subscribe(() => {
          // handle success
        });
    }
  }
}
