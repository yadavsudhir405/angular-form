import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, NgForm} from '@angular/forms';

import { Customer } from './customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerFormGroup: FormGroup;
  customer = new Customer();

  constructor() {
    this.customerFormGroup = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl(),
      sendCatalog: new FormControl(true)
    });
  }

  ngOnInit() {
  }

  save() {
    console.log(this.customer);
    console.log('Saved: ' + JSON.stringify(this.customer));
  }

  populateData() {
    this.customerFormGroup.setValue({
      firstName: 'Test',
      lastName: 'Test',
      email: 'abc@test.com',

    });
  }
}
