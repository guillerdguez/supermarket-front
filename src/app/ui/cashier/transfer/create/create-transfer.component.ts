import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { SelectModule } from "primeng/select";
import { ButtonModule } from "primeng/button";
import { TransferService } from "../../../../services/transfer/transfer.service";
import { ProductService } from "../../../../services/product/product.service";
import { AuthService } from "../../../../services/auth/auth.service";
import { CrudComponent } from "../../../../model/Domain/crud-component";
import { PosPanelComponent } from "../../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../../wrappers/page-shell/page-shell.component";
import { FieldErrorComponent } from "../../../shared/field-error/field-error.component";
import { fieldError } from "../../../../../util/form/field-error";

@Component({
  selector: "app-cashier-create-transfer",
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
  templateUrl: "./create-transfer.component.html",
  styleUrl: "./create-transfer.component.scss",
})
export class CashierCreateTransferComponent implements OnInit, CrudComponent {
  private readonly transfers = inject(TransferService);
  private readonly products = inject(ProductService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  loading = this.transfers.model.loading;
  productList = this.products.model.list;
  branchName = this.auth.model.branchName;

  form = this.fb.nonNullable.group({
    productId: [null as number | null, [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  protected readonly fieldError = fieldError;

  ngOnInit() {
    this.products.retrieveList();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { productId, quantity } = this.form.getRawValue();
    this.transfers.save({ productId: productId!, quantity }, this);
  }

  afterSave() {
    this.router.navigateByUrl("/cashier/transfers");
  }
}
