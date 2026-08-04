export interface PasswordChecks {
  minLength: boolean;
  hasUpperCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

const SPECIAL = /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/~`]/;

export function checkPassword(password: string): PasswordChecks {
  return {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: SPECIAL.test(password),
  };
}

export function isPasswordValid(c: PasswordChecks): boolean {
  return Object.values(c).every(Boolean);
}
