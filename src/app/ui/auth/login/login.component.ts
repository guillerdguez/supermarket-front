import { Component, inject } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { ButtonModule } from "primeng/button";
import { MessageModule } from "primeng/message";
import { AuthService } from "../../../services/auth/auth.service";
import { FieldErrorComponent } from "../../shared/field-error/field-error.component";

function trimmedEmailValidator(control: AbstractControl): ValidationErrors | null {
  const trimmed = ((control.value as string) ?? "").trim();
  if (!trimmed) return null;
  return Validators.email({ value: trimmed } as AbstractControl);
}

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    FieldErrorComponent,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  loading = this.auth.model.loading;

  form = this.fb.nonNullable.group({
    email: ["", [Validators.required, trimmedEmailValidator]],
    password: ["", [Validators.required]],
  });

  fieldError(control: AbstractControl | null, messages: Record<string, string>): string | null {
    if (!control || !(control.touched || control.dirty) || control.valid) return null;
    const key = Object.keys(control.errors ?? {})[0];
    return key ? (messages[key] ?? "Campo inválido") : null;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.getRawValue();
    this.auth.login({ email: email.trim(), password });
  }

  fillDemo(role: "admin" | "cashier") {
    this.form.patchValue({
      email: role === "admin" ? "admin@supermarket.com" : "cashier@supermarket.com",
      password: "password",
    });
  }
}
