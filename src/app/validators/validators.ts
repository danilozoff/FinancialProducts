import { AbstractControl } from "@angular/forms";

async function validateBlanks(control: AbstractControl) {
    const word = (control.value as string);
    if (control.value.trim() === '' || word.length && (word.indexOf(' ') === 0 || word.lastIndexOf(' ') === word.length - 1)) {
      control.setErrors({ hasBlancks: true });
      return { hasBlancks: true };
    }
    return null;
}

export {
    validateBlanks
}