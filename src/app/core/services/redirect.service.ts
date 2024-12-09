import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RedirectService {
  private redirectProduct: 'agileflow' | 'meetflow' | null = null;

  setRedirectProduct(product: 'agileflow' | 'meetflow') {
    this.redirectProduct = product;
  }

  getRedirectProduct() {
    const product = this.redirectProduct;
    this.redirectProduct = null; // Clear after getting
    return product;
  }
}
