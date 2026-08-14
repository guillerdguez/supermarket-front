import { Component, effect, inject, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { SelectModule } from "primeng/select";
import { ButtonModule } from "primeng/button";
import { CashRegisterService } from "../../../services/cash-register/cash-register.service";
import { BranchService } from "../../../services/branch/branch.service";
import { AuthService } from "../../../services/auth/auth.service";
import { OpenRegisterRequest } from "../../../DTO/cash-register.dto";
import { CrudComponent } from "../../../model/Domain/crud-component";
import { PosPanelComponent } from "../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";
import { FieldErrorComponent } from "../../shared/field-error/field-error.component";
import { fieldError } from "../../../../util/form/field-error";

@Component({
  selector: "app-open-register",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    SelectModule,
    ButtonModule,
    PosPanelComponent,
    PosPageShellComponent,
    FieldErrorComponent,
  ],
  templateUrl: "./open-register.component.html",
  styleUrl: "./open-register.component.scss",
})
export class OpenRegisterComponent implements OnInit, CrudComponent {
  private readonly cash = inject(CashRegisterService);
  private readonly branches = inject(BranchService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  loading = this.cash.model.loading;
  error = this.cash.model.error;
  branchList = this.branches.model.list;
  assignedBranchId = this.auth.model.branchId;
  assignedBranchName = this.auth.model.branchName;

  form = this.fb.nonNullable.group({
    branchId: [null as number | null],
    openingBalance: [0, [Validators.required, Validators.min(0)]],
  });

  protected readonly fieldError = fieldError;

  constructor() {
    effect(() => {
      const needsBranch = this.assignedBranchId() == null;
      const ctrl = this.form.controls.branchId;
      ctrl.setValidators(needsBranch ? [Validators.required] : []);
      ctrl.updateValueAndValidity({ emitEvent: false });
    });
  }

  ngOnInit() {
    if (this.assignedBranchId() == null) this.branches.retrieveList();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { branchId, openingBalance } = this.form.getRawValue();
    const body: OpenRegisterRequest =
      this.assignedBranchId() != null
        ? { openingBalance }
        : { branchId: branchId ?? undefined, openingBalance };
    this.cash.open(body, this);
  }

  afterSave() {
    this.router.navigateByUrl("/pos");
  }
}
