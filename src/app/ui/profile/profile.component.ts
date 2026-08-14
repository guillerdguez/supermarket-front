import { Component, effect, inject, OnInit } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { AuthService } from "../../services/auth/auth.service";
import { ProfileService } from "../../services/profile/profile.service";
import { PosPanelComponent } from "../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../wrappers/page-shell/page-shell.component";
import { FieldErrorComponent } from "../shared/field-error/field-error.component";
import { fieldError } from "../../../util/form/field-error";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    PosPanelComponent,
    PosPageShellComponent,
    FieldErrorComponent,
  ],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
})
export class ProfileComponent implements OnInit {
  private readonly profileSvc = inject(ProfileService);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  loading = this.profileSvc.model.loading;

  form = this.fb.nonNullable.group({
    username: ["", [Validators.required]],
    firstName: ["", [Validators.required]],
    lastName: ["", [Validators.required]],
  });

  formValue = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  protected readonly fieldError = fieldError;

  email = "";
  role = "";
  branchName = "";

  constructor() {
    effect(() => {
      const profile = this.profileSvc.model.profile();
      if (!profile) return;
      this.form.patchValue({
        username: profile.username,
        firstName: profile.firstName,
        lastName: profile.lastName,
      });
      this.email = profile.email;
      this.role = profile.role;
      this.branchName = profile.branchName ?? "";
    });
  }

  ngOnInit() {
    this.profileSvc.retrieveDetail();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.profileSvc.save(this.form.getRawValue());
  }

  backLink(): string {
    return this.auth.model.currentUser()?.role === "CASHIER"
      ? "/pos"
      : "/admin/dashboard";
  }
}
