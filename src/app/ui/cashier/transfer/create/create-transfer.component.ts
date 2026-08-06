import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { SelectModule } from "primeng/select";
import { ButtonModule } from "primeng/button";
import { TransferService } from "../../../../services/transfer/transfer.service";
import { ProductService } from "../../../../services/product/product.service";
import { AuthService } from "../../../../services/auth/auth.service";
import { CrudComponent } from "../../../../model/Domain/crud-component";
import { PosPanelComponent } from "../../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../../wrappers/page-shell/page-shell.component";

@Component({
  selector: "app-cashier-create-transfer", standalone: true,
  imports: [FormsModule, RouterLink, SelectModule, ButtonModule, PosPanelComponent, PosPageShellComponent],
  templateUrl: "./create-transfer.component.html", styleUrl: "./create-transfer.component.scss",
})
export class CashierCreateTransferComponent implements OnInit, CrudComponent {
  private readonly transfers = inject(TransferService);
  private readonly products = inject(ProductService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  loading = this.transfers.model.loading;
  productList = this.products.model.list;
  branchName = this.auth.model.branchName;
  // Origen y destino no se piden: el backend siempre pide desde el almacén
  // central y entrega en la sucursal asignada al cajero.
  form: { productId: number; quantity: number } = { productId: 0, quantity: 1 };

  ngOnInit() { this.products.retrieveList(); }

  onSubmit() {
    if (!this.form.productId || this.form.quantity < 1) return;
    this.transfers.save({ productId: this.form.productId, quantity: this.form.quantity }, this);
  }

  afterSave() { this.router.navigateByUrl("/cashier/transfers"); }
}
