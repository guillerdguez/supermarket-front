import { AbstractControl } from "@angular/forms";

export function fieldError(
  control: AbstractControl | null,
  messages: Record<string, string>,
): string | null {
  if (!control || !(control.touched || control.dirty) || control.valid) return null;
  const key = Object.keys(control.errors ?? {})[0];
  return key ? (messages[key] ?? "Campo inválido") : null;
}
