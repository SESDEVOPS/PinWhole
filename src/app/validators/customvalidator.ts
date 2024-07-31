import { AbstractControl, ValidationErrors } from '@angular/forms';

export function customvalidator(control: AbstractControl): ValidationErrors | null {
  return control.value === null ? { invalidValue: true } : null;
}