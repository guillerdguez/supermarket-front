import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export interface PasswordChecks {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

const SPECIAL = /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/~`;']/;

export function checkPassword(password: string): PasswordChecks {
  return {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: SPECIAL.test(password),
  };
}

export function isPasswordValid(c: PasswordChecks): boolean {
  return Object.values(c).every(Boolean);
}

export function passwordRulesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string | null;
    if (!value) return null;
    return isPasswordValid(checkPassword(value)) ? null : { passwordRules: true };
  };
}

export function passwordsMatchValidator(passwordKey: string, confirmKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey)?.value;
    const confirm = group.get(confirmKey)?.value;
    if (!confirm) return null;
    return password === confirm ? null : { passwordsMismatch: true };
  };
}
