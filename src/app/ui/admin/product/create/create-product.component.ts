import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { CurrencyPipe } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { ProductService } from "../../../../services/product/product.service";
import { ProductRequest } from "../../../../DTO/product.dto";
import { CrudComponent } from "../../../../model/Domain/crud-component";
import { PosPanelComponent } from "../../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../../wrappers/page-shell/page-shell.component";

@Component({
  selector: "app-create-product",
  standalone: true,
  imports: [FormsModule, RouterLink, CurrencyPipe, ButtonModule, PosPanelComponent, PosPageShellComponent],
  templateUrl: "./create-product.component.html",
  styleUrl: "./create-product.component.scss",
})
export class CreateProductComponent implements CrudComponent {
  private readonly products = inject(ProductService);
  private readonly router = inject(Router);

  loading = this.products.model.loading;

  form: ProductRequest = {
    name: "",
    barcode: "",
    price: 0,
    category: "",
  };

  onSubmit() {
    if (!this.form.name.trim() || this.form.price <= 0) return;
    this.products.save(this.form, undefined, this);
  }

  afterSave() {
    this.router.navigateByUrl("/admin/products");
  }
}
