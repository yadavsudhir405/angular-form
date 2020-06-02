import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {Customer} from './customer';
import rangeValidator from './range-validator';
import {emailMatcher} from './email-group-validator';

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
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', [Validators.required]],
      }, {validator: emailMatcher}),
      phone: '',
      rating: [null, [Validators.required, rangeValidator(1, 5)]],
      sendNotifications: 'email',
      sendCatalog: {value: true},
    });

    this.customerFormGroup.get('sendNotifications').valueChanges
      .subscribe(value => {
        this.setNotifications(value);
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

  setNotifications(notificationMedium: string) {
    const phoneControl = this.customerFormGroup.get('phone');
    const emailControl = this.customerFormGroup.get('emailGroup.email');
    if (notificationMedium === 'phone') {
      phoneControl.setValidators([Validators.required]);
      emailControl.clearValidators();
    } else {
      emailControl.setValidators([Validators.required, Validators.email]);
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
    emailControl.updateValueAndValidity();
  }
}
