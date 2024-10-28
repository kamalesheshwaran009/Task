// future-date.validator.ts
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const currentDate = new Date();
    const selectedDate = new Date(control.value);
    return selectedDate < currentDate ? { 'pastDate': { value: control.value } } : null;
  };
}
