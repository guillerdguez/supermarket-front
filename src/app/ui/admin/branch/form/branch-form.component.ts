import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { BranchService } from "../../../../services/branch/branch.service";
import { CrudComponent } from "../../../../model/Domain/crud-component";
import { PosPanelComponent } from "../../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../../wrappers/page-shell/page-shell.component";
import { FieldErrorComponent } from "../../../shared/field-error/field-error.component";

@Component({
  selector: "app-branch-form",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    PosPanelComponent,
    PosPageShellComponent,
    FieldErrorComponent,
  ],
  templateUrl: "./branch-form.component.html",
  styleUrl: "./branch-form.component.scss",
})
export class BranchFormComponent implements OnInit, CrudComponent {
  private readonly svc = inject(BranchService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  loading = this.svc.model.loading;
  ready = signal(false);
  id: number | null = null;

  isPreview = false;

  form = this.fb.nonNullable.group({
    name: ["", [Validators.required]],
    address: ["", [Validators.required]],
    isWarehouse: [false],
  });

  get isEdit(): boolean {
    return this.id != null;
  }

  constructor() {
    effect(() => {
      const branch = this.svc.model.editing();
      if (!branch) return;
      this.form.patchValue({
        name: branch.name,
        address: branch.address || "",
        isWarehouse: branch.isWarehouse ?? false,
      });
      this.ready.set(true);
    });
  }

  ngOnInit() {
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
    this.svc.save(this.form.getRawValue(), this.id ?? undefined, this);
  }

  afterSave() {
    if (this.isPreview) {
      window.close();
      return;
    }
    this.router.navigateByUrl("/admin/branches");
  }
  closePreview() {
    window.close();
  }
}
