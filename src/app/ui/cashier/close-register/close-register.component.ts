import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CurrencyPipe } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CashRegisterService } from "../../../services/cash-register/cash-register.service";
import { AuthService } from "../../../services/auth/auth.service";
import { CrudComponent } from "../../../model/Domain/crud-component";
import { PosPanelComponent } from "../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../wrappers/page-shell/page-shell.component";
import { FieldErrorComponent } from "../../shared/field-error/field-error.component";
import { fieldError } from "../../../../util/form/field-error";

@Component({
  selector: "app-close-register",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CurrencyPipe,
    ButtonModule,
    PosPanelComponent,
    PosPageShellComponent,
    FieldErrorComponent,
  ],
  templateUrl: "./close-register.component.html",
  styleUrl: "./close-register.component.scss",
})
export class CloseRegisterComponent implements OnInit, CrudComponent {
  private readonly cash = inject(CashRegisterService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  loading = this.cash.model.loading;
  current = this.cash.model.current;

  form = this.fb.nonNullable.group({
    closingBalance: [0, [Validators.required, Validators.min(0)]],
  });

  protected readonly fieldError = fieldError;

  ngOnInit() {
    const branch = this.auth.model.branchId();
    if (!this.current() && branch != null) this.cash.retrieveCurrent(branch);
  }

  onSubmit() {
    const reg = this.current();
    if (!reg || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cash.close(reg.id, { closingBalance: this.form.getRawValue().closingBalance }, this);
  }

  afterSave() {
    this.router.navigateByUrl("/cashier/dashboard");
  }
}
