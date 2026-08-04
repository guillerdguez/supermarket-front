import { Injectable, signal } from "@angular/core";
import { ProductResponse } from "../../DTO/product.dto";


@Injectable({ providedIn: "root" })
export class ProductModel {
  readonly list = signal<ProductResponse[]>([]);
  readonly editing = signal<ProductResponse | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
