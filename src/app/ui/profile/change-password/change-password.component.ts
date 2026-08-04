import { Component, inject, computed, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ProfileService } from "../../../services/profile/profile.service";
import { CrudComponent } from "../../../model/Domain/crud-component";
import { PosPanelComponent } from "../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";

@Component({
  selector: "app-change-password",
  standalone: true,
  imports: [FormsModule, RouterLink, ButtonModule, PosPanelComponent, PosPageShellComponent],
  templateUrl: "./change-password.component.html",
  styleUrl: "./change-password.component.scss",
})
export class ChangePasswordComponent implements CrudComponent {
  private readonly profileSvc = inject(ProfileService);
  private readonly router = inject(Router);
  private readonly messages = inject(MessageService);

  loading = this.profileSvc.model.loading;

  currentPassword = "";
  newPassword = signal("");
  confirmPassword = "";
  mismatch = signal(false);

  rules = computed(() => {
    const p = this.newPassword();
    return {
      minLength: p.length >= 8,
      hasUpperCase: /[A-Z]/.test(p),
      hasNumber: /\d/.test(p),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\|;'/`~]/.test(p),
    };
  });

  isPasswordValid = computed(() => {
    const r = this.rules();
    return r.minLength && r.hasUpperCase && r.hasNumber && r.hasSpecialChar;
  });

  onNewPasswordChange(value: string) {
    this.newPassword.set(value);
    this.mismatch.set(false);
  }

  onSubmit() {
    if (!this.currentPassword) {
      this.messages.add({
        severity: "warn",
        summary: "Contraseña",
        detail: "Introduce tu contraseña actual",
      });
      return;
    }

    if (!this.isPasswordValid()) {
      this.messages.add({
        severity: "warn",
        summary: "Contraseña",
        detail: "La nueva contraseña no cumple todas las reglas",
      });
      return;
    }

    if (this.newPassword() !== this.confirmPassword) {
      this.mismatch.set(true);
      this.messages.add({
        severity: "error",
        summary: "Contraseña",
        detail: "Las contraseñas no coinciden",
      });
      return;
    }

    this.profileSvc.changePassword(
      {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword(),
      },
      this,
    );
  }

  afterSave() {
    this.router.navigateByUrl("/profile");
  }
}
