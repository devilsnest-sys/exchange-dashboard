import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../AuthService';
import { ShopifyService } from '../services/shopify.servce';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  customerForm!: FormGroup;
  orderForm!: FormGroup;

  customer = [
    { ph_no : '9898989798' },
    { ph_no : '1234567890' }
  ];
  
  orders: any[] = [];

  constructor(private formBuilder: FormBuilder,private shopifyService: ShopifyService) { }

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      customerNumber: ['', Validators.required]
    });

    this.orderForm = this.formBuilder.group({
      orderID: ['', Validators.required]
    });

    this.shopifyService.getOrders().subscribe(
      (data) => {
        this.orders = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

 onCustomerSubmit() {
    if (this.customerForm.valid) {
      const enteredNumber = this.customerForm.value.customerNumber;
      const customerExists = this.customer.some(c => c.ph_no === enteredNumber);
      if (customerExists) {
        console.log('Customer exists');
      } else {
        console.log('Customer does not exist');
      }
    } else {
      console.log('Invalid form');
    }
  }


  onOrderSubmit() {
    if (this.orderForm.valid) {
      console.log('Order ID:', this.orderForm.value.orderID);
    } else {
      console.log('Invalid form');
    }
  }
}
