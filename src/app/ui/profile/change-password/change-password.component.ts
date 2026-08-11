import { Component, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { ProfileService } from "../../../services/profile/profile.service";
import { MessageProcessingService } from "../../../../util/messageProcessingCenter/message-processing.service";
import { CrudComponent } from "../../../model/Domain/crud-component";
import { PosPanelComponent } from "../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";
import { checkPassword, passwordRulesValidator, passwordsMatchValidator } from "../../../services/utils/password.validator";
import { FieldErrorComponent } from "../../shared/field-error/field-error.component";
import { fieldError } from "../../../../util/form/field-error";

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
  private readonly messages = inject(MessageProcessingService);
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

  protected readonly fieldError = fieldError;

  onSubmit() {
    if (this.form.controls.currentPassword.invalid) {
      this.form.controls.currentPassword.markAsTouched();
      this.messages.publishWarnMsg("passwordCurrentRequired");
      return;
    }

    if (this.form.controls.newPassword.invalid) {
      this.form.controls.newPassword.markAsTouched();
      this.messages.publishWarnMsg("passwordRulesNotMet");
      return;
    }

    if (this.form.errors?.["passwordsMismatch"]) {
      this.form.markAllAsTouched();
      this.messages.publishErrorMsg("passwordsMismatch");
      return;
    }

    const { currentPassword, newPassword } = this.form.getRawValue();
    this.profileSvc.changePassword({ currentPassword, newPassword }, this);
  }

  afterSave() {
    this.router.navigateByUrl("/account");
  }
}
