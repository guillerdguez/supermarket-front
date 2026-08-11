import { Component, computed, effect, inject, OnInit, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { TagModule } from "primeng/tag";
import { UserService } from "../../../../services/user/user.service";
import { BranchService } from "../../../../services/branch/branch.service";
import { UserRequest } from "../../../../DTO/user.dto";
import { CrudComponent } from "../../../../model/Domain/crud-component";
import { USER_ROLE_OPTIONS } from "../../../../model/Domain/user.model";
import { PosPanelComponent } from "../../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../../wrappers/page-shell/page-shell.component";
import { FieldErrorComponent } from "../../../shared/field-error/field-error.component";
import { fieldError } from "../../../../../util/form/field-error";

@Component({
  selector: "app-user-form",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    SelectModule,
    TagModule,
    PosPanelComponent,
    PosPageShellComponent,
    FieldErrorComponent,
  ],
  templateUrl: "./user-form.component.html",
  styleUrl: "./user-form.component.scss",
})
export class UserFormComponent implements OnInit, CrudComponent {
  private readonly svc = inject(UserService);
  private readonly branches = inject(BranchService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  isPreview = false;
  cambiarPassword = signal(false);

  loading = this.svc.model.loading;
  error = this.svc.model.error;
  editingUser = this.svc.model.editing;
  ready = signal(false);
  id = signal<number | null>(null);

  branchList = this.branches.model.list;
  readonly roleOptions = USER_ROLE_OPTIONS;

  form = this.fb.nonNullable.group({
    username: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
    password: [""],
    firstName: ["", [Validators.required]],
    lastName: ["", [Validators.required]],
    role: ["CASHIER"],
    branchId: [null as number | null],
  });

  formValue = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  isEdit = computed(() => this.id() != null);

  constructor() {
    effect(() => {
      const needsPassword = !this.isEdit() || this.cambiarPassword();
      const pwCtrl = this.form.controls.password;
      pwCtrl.setValidators(needsPassword ? [Validators.required, Validators.minLength(8)] : []);
      pwCtrl.updateValueAndValidity({ emitEvent: false });
    });

    effect(() => {
      const user = this.svc.model.editing();
      if (!user) return;
      this.form.patchValue({
        username: user.username,
        email: user.email,
        password: "",
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        branchId: user.branchId ?? null,
      });
      this.ready.set(true);
    });
  }

  ngOnInit() {
    this.branches.retrieveList();
    const idParam = this.route.snapshot.paramMap.get("id");
    this.id.set(idParam ? Number(idParam) : null);
    this.isPreview =
      this.route.snapshot.queryParamMap.get("isPreview") === "true";

    if (this.isEdit()) {
      this.svc.retrieveDetail(this.id()!);
    } else {
      this.ready.set(true);
    }
  }

  get initials(): string {
    const f = this.formValue().firstName?.trim().charAt(0) ?? "";
    const l = this.formValue().lastName?.trim().charAt(0) ?? "";
    return (f + l).toUpperCase() || "?";
  }

  roleLabel(role?: string | null): string {
    return this.roleOptions.find((r) => r.value === role)?.label ?? role ?? "—";
  }

  roleSeverity(role?: string | null): "danger" | "warn" | "info" {
    if (role === "ADMIN") return "danger";
    if (role === "MANAGER") return "warn";
    return "info";
  }

  selectedBranchName(): string | null {
    return (
      this.branchList().find((b) => b.id === this.formValue().branchId)?.name ??
      null
    );
  }

  protected readonly fieldError = fieldError;

  cancelPasswordChange() {
    this.cambiarPassword.set(false);
    this.form.controls.password.setValue("");
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: UserRequest = { ...this.form.getRawValue() };
    if (this.isEdit() && !this.cambiarPassword()) {
      delete payload.password;
    }
    this.svc.save(payload, this.id() ?? undefined, this);
  }

  afterSave() {
    if (this.isPreview) {
      window.close();
      return;
    }
    this.router.navigateByUrl("/admin/users");
  }
  closePreview() {
    window.close();
  }
}
