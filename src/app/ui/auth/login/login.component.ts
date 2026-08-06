import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { ButtonModule } from "primeng/button";
import { MessageModule } from "primeng/message";
import { AuthService } from "../../../services/auth/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule, InputTextModule, PasswordModule, ButtonModule, MessageModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  private readonly auth = inject(AuthService);

  email = "";
  password = "";
  loading = this.auth.model.loading;
  submitted = signal(false);

  onSubmit() {
    this.submitted.set(true);
    if (!this.email.trim() || !this.password) return;
    this.auth.login({
      email: this.email.trim(),
      password: this.password,
    });
  }

  fillDemo(role: "admin" | "cashier") {
    this.email = role === "admin" ? "admin@supermarket.com" : "cashier@supermarket.com";
    this.password = "password";
  }
}
