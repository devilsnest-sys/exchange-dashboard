// shopify.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ShopifyService {

  constructor(private http: HttpClient) { }

  getOrder(orderId: string) {
    return this.http.get<any>('http://localhost:5000/orders/' + orderId);
    //  return this.http.get<any[]>('http://localhost:5000/orders/');
  }
  getProductBySku(sku: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:5000/products/${sku}`);
  }
  // getProducts(): Observable<any[]> {
  //   return this.http.get<any[]>('http://localhost:5000/products');
  // }
  
}
