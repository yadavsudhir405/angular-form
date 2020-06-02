import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

import {Customer} from './customer';
import rangeValidator from './range-validator';
import {emailMatcher} from './email-group-validator';
import {debounce, debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerFormGroup: FormGroup;
  customer = new Customer();
  errorMsgs = {
    firstName: '',
    email: '',
    confirmEmail: '',
  };
  private validationMessages = {
    firstName: {
      required: 'Please enter your first name',
      minlength: 'The first name must be longer than 3 characters'
    },
    email: {
      required: 'Please enter your email address.',
      email: 'Please enter a valid email address.'
    },
    confirmEmail: {
      required: 'Please enter your confirm email address',
      match: 'Email doesnt match'
    }
  };

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
        addresses: this.formBuilder.array([this.buildAddress()]),
      }
    );
    const firstNameControl =  this.customerFormGroup.get('firstName');
    firstNameControl.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(value => {
      this.setErrorMessage('firstName', firstNameControl);
    });

    this.customerFormGroup.get('sendNotifications').valueChanges
      .subscribe(value => {
        this.setNotifications(value);
      });
  }

  buildAddress(): FormGroup {
    return this.formBuilder.group({
      addressType: '',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
    });
  }

  get addresses(): FormArray {
    return this.customerFormGroup.get('addresses') as FormArray;
  }

  addAddress(): void {
    this.addresses.push(this.buildAddress());
  }

  setErrorMessage(field: string, formControl: AbstractControl) {
    this.errorMsgs[field] = '';
    if ((formControl.touched || formControl.dirty) && formControl.errors) {
      this.errorMsgs[field] = Object.keys(formControl.errors)
        .map(key => this.validationMessages[field][key]).join(' ');
    }
    console.log(this.errorMsgs[field]);
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
