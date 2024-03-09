import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../AuthService';
import { ShopifyService } from '../services/shopify.servce';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  customerForm!: FormGroup;
  orderForm!: FormGroup;
  serialNumber: number = 1;
  orders: any[] = [];
  subtotal: number = 0;
  products: any[] = [];
  selectedProducts: any[] = [];
  productCtrl = new FormControl();
  filteredProducts!: Observable<any[]>;

  constructor(private formBuilder: FormBuilder,private shopifyService: ShopifyService, private http: HttpClient) { }

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      customerNumber: ['', Validators.required]
    });

    this.orderForm = this.formBuilder.group({
      orderID: ['', Validators.required]
    });
    this.calculateSubtotal();
    this.shopifyService.getProducts().subscribe(products => {
      this.products = products;
      console.log(products);
      this.filteredProducts = this.productCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterProducts(value))
      );
    });
  }
  private _filterProducts(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.products.filter(product => product.name.toLowerCase().includes(filterValue));
  }
  displayFn(product: any): string {
    return product && product.name ? product.name : '';
  }

  addProduct(product: any): void {
    if (!this.selectedProducts.find(p => p.id === product.id)) {
      this.selectedProducts.push(product);
    }
    this.productCtrl.setValue('');
  }
  removeProduct(product: any): void {
    const index = this.selectedProducts.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.selectedProducts.splice(index, 1);
    }
  }
  calculateSubtotal() {
    this.subtotal = this.orders.reduce((acc, order) => {
        return acc + order.line_items.reduce((acc: number, item: { price: string; }) => {
            return acc + parseFloat(item.price);
        }, 0);
    }, 0);
}
  removeCheckedItems() {
    this.orders.forEach(order => {
        order.line_items = order.line_items.filter((item: { checked: any; }) => !item.checked);
    });
    this.calculateSubtotal();
  }



  onOrderSubmit() {
    const orderId = this.orderForm.get('orderID')?.value;

    if (!orderId) {
        console.error('Order ID is required');
        return;
    }

    this.shopifyService.getOrder(orderId).subscribe(
        (order) => {
            this.orders = [order];
        },
        (error) => {
            console.error('Error fetching order:', error);
            this.orders = [];
        }
    );
}


  
}
