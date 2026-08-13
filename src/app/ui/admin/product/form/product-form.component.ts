import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CurrencyPipe } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { ProductService } from "../../../../services/product/product.service";
import { CrudComponent } from "../../../../model/Domain/crud-component";
import { PosPanelComponent } from "../../../wrappers/panel/panel.component";
import { PosPageShellComponent } from "../../../wrappers/page-shell/page-shell.component";
import { FieldErrorComponent } from "../../../shared/field-error/field-error.component";
import { fieldError } from "../../../../../util/form/field-error";

@Component({
  selector: "app-product-form",
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
  templateUrl: "./product-form.component.html",
  styleUrl: "./product-form.component.scss",
})
export class ProductFormComponent implements OnInit, CrudComponent {
  private readonly products = inject(ProductService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  loading = this.products.model.loading;
  ready = signal(false);
  id: number | null = null;

  isPreview = false;

  form = this.fb.nonNullable.group({
    name: ["", [Validators.required]],
    barcode: [""],
    price: [0, [Validators.required, Validators.min(0.01)]],
    category: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
  });

  formValue = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  get isEdit(): boolean {
    return this.id != null;
  }

  constructor() {
    effect(() => {
      const product = this.products.model.editing();
      if (!product) return;
      this.form.patchValue({
        name: product.name,
        barcode: product.barcode || "",
        price: product.price,
        category: product.category || "",
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
      this.products.retrieveDetail(this.id!);
    } else {
      this.ready.set(true);
    }
  }

  protected readonly fieldError = fieldError;

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.products.save(this.form.getRawValue(), this.id ?? undefined, this);
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
