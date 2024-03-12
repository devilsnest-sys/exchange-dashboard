import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShopifyService } from '../services/shopify.servce';
import { HttpClient } from '@angular/common/http';

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
  prodForm!: FormGroup;
  checkedProducts: any[] = [];


  constructor(private formBuilder: FormBuilder, private shopifyService: ShopifyService, private http: HttpClient) { }

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      customerNumber: ['', Validators.required]
    });

    this.orderForm = this.formBuilder.group({
      orderID: ['', Validators.required]
    });

    this.prodForm = this.formBuilder.group({
      ProdSku: ['', Validators.required]
    });
    // this.shopifyService.getProducts().subscribe(products => {
    //   this.products = products;
    //   console.log(products);
    // });
  }

  calculateSubtotal() {
    let allItems = this.orders.flatMap(order => order.line_items);
    allItems = allItems.concat(this.checkedProducts);
    
    this.subtotal = allItems.reduce((acc, item) => {
        const itemPrice = parseFloat(item.price) || 0;
        const variantPrice = parseFloat(item.variants?.[0]?.price || item.variants?.price || 0);
        const totalPrice = itemPrice + variantPrice;
        // console.log(`Item: ${item.title}, Item Price: ${itemPrice}, Variant Price: ${variantPrice}, Total Price: ${totalPrice}`);
        return acc + totalPrice;
    }, 0);
}





  removeCheckedItems() {
    let allItems = this.orders.flatMap(order => order.line_items);
    allItems = allItems.concat(this.checkedProducts);

    allItems = allItems.filter(item => !item.checked);

    let index = 0;
    this.orders.forEach(order => {
        const count = order.line_items.length;
        order.line_items = allItems.slice(index, index + count);
        index += count;
    });
    this.checkedProducts = allItems.slice(index);

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
        this.calculateSubtotal();
      },
      (error) => {
        console.error('Error fetching order:', error);
        this.orders = [];
      }
    );
  }

  onProdSubmit() {
    const prodSkuControl = this.prodForm.get('ProdSku');
    if (!prodSkuControl) {
      console.error('Product SKU control not found');
      return;
    }

    const prodSku = prodSkuControl.value;
    console.log(prodSku);

    this.shopifyService.getProductBySku(prodSku).subscribe(
      (products) => {
        this.products = products.filter((product: any) => product.variants[0].sku === prodSku);
      },
      (error) => {
        console.error('Error Fetching Product:', error);
        this.products = [];
      }
    );
  }

  onProductCheckboxChange(event: any, product: any) {
    if (event.target.checked) {
        this.checkedProducts.push(product);
    } else {
        const index = this.checkedProducts.indexOf(product);
        if (index !== -1) {
            this.checkedProducts.splice(index, 1);
        }
    }
    this.calculateSubtotal();
  }


}
