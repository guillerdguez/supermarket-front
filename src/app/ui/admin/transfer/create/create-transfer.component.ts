import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { SelectModule } from "primeng/select";
import { ButtonModule } from "primeng/button";
import { TransferService } from "../../../../services/transfer/transfer.service";
import { BranchService } from "../../../../services/branch/branch.service";
import { ProductService } from "../../../../services/product/product.service";
import { TransferRequest } from "../../../../DTO/transfer.dto";
import { CrudComponent } from "../../../../model/Domain/crud-component";
import { PosPanelComponent } from "../../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../../wrappers/page-shell/page-shell.component";
@Component({
  selector: "app-create-transfer", standalone: true,
  imports: [FormsModule, RouterLink, SelectModule, ButtonModule, PosPanelComponent, PosPageShellComponent],
  templateUrl: "./create-transfer.component.html", styleUrl: "./create-transfer.component.scss",
})
export class CreateTransferComponent implements OnInit, CrudComponent {
  private readonly transfers = inject(TransferService);
  private readonly branches = inject(BranchService);
  private readonly products = inject(ProductService);
  private readonly router = inject(Router);
  loading = this.transfers.model.loading;
  branchList = this.branches.model.list;
  productList = this.products.model.list;
  form: TransferRequest = { sourceBranchId:0, targetBranchId:0, productId:0, quantity:1 };
  ngOnInit() { this.branches.retrieveList(); this.products.retrieveList(); }
  onSubmit() {
    if (!this.form.sourceBranchId || !this.form.targetBranchId || !this.form.productId || this.form.quantity < 1) return;
    this.transfers.save(this.form, this);
  }
  afterSave() { this.router.navigateByUrl("/admin/transfers"); }
}
