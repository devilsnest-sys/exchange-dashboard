// shopify.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShopifyService {

  constructor(private http: HttpClient) { }

  getOrders() {
    return this.http.get<any[]>('http://localhost:5000/orders');
  }
}
