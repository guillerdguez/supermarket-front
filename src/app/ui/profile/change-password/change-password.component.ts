import { Component, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ProfileService } from "../../../services/profile/profile.service";
import { CrudComponent } from "../../../model/Domain/crud-component";
import { PosPanelComponent } from "../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";
import { checkPassword, passwordRulesValidator, passwordsMatchValidator } from "../../../services/utils/password.validator";
import { FieldErrorComponent } from "../../shared/field-error/field-error.component";

@Component({
  selector: "app-change-password",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    PosPanelComponent,
    PosPageShellComponent,
    FieldErrorComponent,
  ],
  templateUrl: "./change-password.component.html",
  styleUrl: "./change-password.component.scss",
})
export class ChangePasswordComponent implements CrudComponent {
  private readonly profileSvc = inject(ProfileService);
  private readonly router = inject(Router);
  private readonly messages = inject(MessageService);
  private readonly fb = inject(FormBuilder);

  loading = this.profileSvc.model.loading;

  form = this.fb.nonNullable.group(
    {
      currentPassword: ["", [Validators.required]],
      newPassword: ["", [Validators.required, passwordRulesValidator()]],
      confirmPassword: ["", [Validators.required]],
    },
    { validators: [passwordsMatchValidator("newPassword", "confirmPassword")] },
  );

  private readonly newPasswordValue = toSignal(this.form.controls.newPassword.valueChanges, {
    initialValue: "",
  });

  rules = computed(() => checkPassword(this.newPasswordValue() ?? ""));

  fieldError(control: AbstractControl | null, messages: Record<string, string>): string | null {
    if (!control || !(control.touched || control.dirty) || control.valid) return null;
    const key = Object.keys(control.errors ?? {})[0];
    return key ? (messages[key] ?? "Campo inválido") : null;
  }

  onSubmit() {
    if (this.form.controls.currentPassword.invalid) {
      this.form.controls.currentPassword.markAsTouched();
      this.messages.add({
        severity: "warn",
        summary: "Contraseña",
        detail: "Introduce tu contraseña actual",
      });
      return;
    }

    if (this.form.controls.newPassword.invalid) {
      this.form.controls.newPassword.markAsTouched();
      this.messages.add({
        severity: "warn",
        summary: "Contraseña",
        detail: "La nueva contraseña no cumple todas las reglas",
      });
      return;
    }

    if (this.form.errors?.["passwordsMismatch"]) {
      this.form.markAllAsTouched();
      this.messages.add({
        severity: "error",
        summary: "Contraseña",
        detail: "Las contraseñas no coinciden",
      });
      return;
    }

    const { currentPassword, newPassword } = this.form.getRawValue();
    this.profileSvc.changePassword({ currentPassword, newPassword }, this);
  }

  afterSave() {
    this.router.navigateByUrl("/account");
  }
}
