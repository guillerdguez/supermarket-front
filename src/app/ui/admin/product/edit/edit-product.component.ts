import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CurrencyPipe } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { ProductService } from "../../../../services/product/product.service";
import { ProductRequest } from "../../../../DTO/product.dto";
import { CrudComponent } from "../../../../model/Domain/crud-component";
import { PosPanelComponent } from "../../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../../wrappers/page-shell/page-shell.component";

@Component({
  selector: "app-edit-product",
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    CurrencyPipe,
    ButtonModule,
    PosPanelComponent,
    PosPageShellComponent,
  ],
  templateUrl: "./edit-product.component.html",
  styleUrl: "./edit-product.component.scss",
})
export class EditProductComponent implements OnInit, CrudComponent {
  private readonly products = inject(ProductService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loading = this.products.model.loading;
  loadingProduct = signal(true);
  productId = 0;

  isPreview = false;

  form: ProductRequest = {
    name: "",
    barcode: "",
    price: 0,
    category: "",
  };

  constructor() {
    effect(() => {
      const product = this.products.model.editing();
      if (!product) return;
      this.form = {
        name: product.name,
        barcode: product.barcode || "",
        price: product.price,
        category: product.category || "",
      };
      this.loadingProduct.set(false);
    });
  }

  ngOnInit() {
    this.productId = Number(this.route.snapshot.paramMap.get("id"));
    this.isPreview =
      this.route.snapshot.queryParamMap.get("isPreview") === "true";
    this.products.retrieveDetail(this.productId);
  }

  onSubmit() {
    if (!this.form.name.trim() || this.form.price <= 0) return;
    this.products.save(this.form, this.productId, this);
  }

  afterSave() {
    if (this.isPreview) {
      window.close();
      return;
    }
    this.router.navigateByUrl("/admin/products");
  }
  closePreview() {
    window.close();
  }
}
