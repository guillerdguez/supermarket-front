import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { SelectModule } from "primeng/select";
import { ButtonModule } from "primeng/button";
import { TransferService } from "../../../../services/transfer/transfer.service";
import { BranchService } from "../../../../services/branch/branch.service";
import { ProductService } from "../../../../services/product/product.service";
import { CrudComponent } from "../../../../model/Domain/crud-component";
import { PosPanelComponent } from "../../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../../wrappers/page-shell/page-shell.component";
import { FieldErrorComponent } from "../../../shared/field-error/field-error.component";
import { fieldError } from "../../../../../util/form/field-error";

@Component({
  selector: "app-create-transfer",
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
export class CreateTransferComponent implements OnInit, CrudComponent {
  private readonly transfers = inject(TransferService);
  private readonly branches = inject(BranchService);
  private readonly products = inject(ProductService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  loading = this.transfers.model.loading;
  branchList = this.branches.model.list;
  productList = this.products.model.list;

  form = this.fb.nonNullable.group({
    sourceBranchId: [null as number | null, [Validators.required]],
    targetBranchId: [null as number | null, [Validators.required]],
    productId: [null as number | null, [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  protected readonly fieldError = fieldError;

  ngOnInit() {
    this.branches.retrieveList();
    this.products.retrieveList();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { sourceBranchId, targetBranchId, productId, quantity } = this.form.getRawValue();
    this.transfers.save(
      { sourceBranchId: sourceBranchId!, targetBranchId: targetBranchId!, productId: productId!, quantity },
      this,
    );
  }

  afterSave() {
    this.router.navigateByUrl("/admin/transfers");
  }
}
