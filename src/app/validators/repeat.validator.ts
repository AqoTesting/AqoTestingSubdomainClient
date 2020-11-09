import { AbstractControl, ValidatorFn } from '@angular/forms';

class RepeatValidator {
  static RepeatValidator(compared: AbstractControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (compared.value != control.value) {
        return { repeat: true };
      }
      return null;
    };
  }
}

export default RepeatValidator.RepeatValidator;
