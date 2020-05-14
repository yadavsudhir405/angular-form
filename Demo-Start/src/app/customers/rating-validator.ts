import {AbstractControl} from '@angular/forms';

export default function ratingValidator(control: AbstractControl): {[key: string]: boolean | null } {
  if (control.value !== null && (isNaN(control.value) || control.value < 1 || control.value > 5)) {
      return {range: true};
  }
  return null;
}
