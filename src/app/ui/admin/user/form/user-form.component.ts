import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
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

@Component({
  selector: "app-user-form",
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    ButtonModule,
    SelectModule,
    TagModule,
    PosPanelComponent,
    PosPageShellComponent,
  ],
  templateUrl: "./user-form.component.html",
  styleUrl: "./user-form.component.scss",
})
export class UserFormComponent implements OnInit, CrudComponent {
  private readonly svc = inject(UserService);
  private readonly branches = inject(BranchService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  isPreview = false;
  cambiarPassword = false;

  loading = this.svc.model.loading;
  error = this.svc.model.error;
  editingUser = this.svc.model.editing;
  ready = signal(false);
  id: number | null = null;

  branchList = this.branches.model.list;
  readonly roleOptions = USER_ROLE_OPTIONS;
  form: UserRequest = {
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "CASHIER",
    branchId: null,
  };

  get isEdit(): boolean {
    return this.id != null;
  }

  constructor() {
    effect(() => {
      const user = this.svc.model.editing();
      if (!user) return;
      this.form = {
        username: user.username,
        email: user.email,
        password: "",
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        branchId: user.branchId ?? null,
      };
      this.ready.set(true);
    });
  }

  ngOnInit() {
    this.branches.retrieveList();
    const idParam = this.route.snapshot.paramMap.get("id");
    this.id = idParam ? Number(idParam) : null;
    this.isPreview =
      this.route.snapshot.queryParamMap.get("isPreview") === "true";

    if (this.isEdit) {
      this.svc.retrieveDetail(this.id!);
    } else {
      this.ready.set(true);
    }
  }

  get initials(): string {
    const f = this.form.firstName?.trim().charAt(0) ?? "";
    const l = this.form.lastName?.trim().charAt(0) ?? "";
    return (f + l).toUpperCase() || "?";
  }

  roleLabel(role?: string): string {
    return this.roleOptions.find((r) => r.value === role)?.label ?? role ?? "—";
  }

  roleSeverity(role?: string): "danger" | "warn" | "info" {
    if (role === "ADMIN") return "danger";
    if (role === "MANAGER") return "warn";
    return "info";
  }

  selectedBranchName(): string | null {
    return (
      this.branchList().find((b) => b.id === this.form.branchId)?.name ??
      null
    );
  }

  cancelPasswordChange() {
    this.cambiarPassword = false;
    this.form.password = "";
  }

  onSubmit() {
    if (!this.form.username.trim() || !this.form.email.trim()) return;
    if (!this.isEdit && !this.form.password) return;

    const payload = { ...this.form };
    if (this.isEdit && !this.cambiarPassword) {
      delete payload.password;
    }
    this.svc.save(payload, this.id ?? undefined, this);
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
