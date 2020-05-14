import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

import {Customer} from './customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerFormGroup: FormGroup;
  customer = new Customer();

  constructor(private readonly formBuilder: FormBuilder) {}

  ngOnInit() {
    this.customerFormGroup = this.formBuilder.group({
      firstName: [''],
      lastName: [{value: '', disabled: false}],
      email: [{value: 'ad@gmail.com', disabled: true}],
      sendCatalog: {value: true},
    });
  }

  save() {
    console.log(this.customerFormGroup.value);
    console.log('Saved: ' + JSON.stringify(this.customerFormGroup.value));
  }

  populateData() {
    this.customerFormGroup.patchValue({
      firstName: 'Test',
      lastName: 'Test',
      email: 'abc@test.com',
    });
  }
}
