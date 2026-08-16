import { Component, effect, inject, OnInit } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { AuthService } from "../../services/auth/auth.service";
import { ProfileService } from "../../services/profile/profile.service";
import { BranchService } from "../../services/branch/branch.service";
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
    SelectModule,
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
  private readonly branches = inject(BranchService);
  private readonly fb = inject(FormBuilder);

  loading = this.profileSvc.model.loading;
  branchList = this.branches.model.list;

  form = this.fb.nonNullable.group({
    username: ["", [Validators.required]],
    firstName: ["", [Validators.required]],
    lastName: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
    branchId: [null as number | null],
  });

  formValue = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  protected readonly fieldError = fieldError;

  email = "";
  role = "";
  branchName = "";
  canEditSensitive = false;

  constructor() {
    effect(() => {
      const profile = this.profileSvc.model.profile();
      if (!profile) return;
      this.form.patchValue({
        username: profile.username,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        branchId: profile.branchId ?? null,
      });
      this.email = profile.email;
      this.role = profile.role;
      this.branchName = profile.branchName ?? "";
      this.canEditSensitive = profile.role === "ADMIN" || profile.role === "MANAGER";

      if (this.canEditSensitive) {
        this.form.controls.email.enable({ emitEvent: false });
        this.form.controls.branchId.enable({ emitEvent: false });
      } else {
        this.form.controls.email.disable({ emitEvent: false });
        this.form.controls.branchId.disable({ emitEvent: false });
      }
    });
  }

  ngOnInit() {
    this.profileSvc.retrieveDetail();
    const role = this.auth.model.currentUser()?.role;
    if (role === "ADMIN" || role === "MANAGER") {
      this.branches.retrieveList();
    }
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
