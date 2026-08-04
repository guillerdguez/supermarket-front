import { Injectable, signal } from "@angular/core";
import { ProductResponse } from "../../DTO/product.dto";

/**
 * Estado compartido del dominio de productos. Solo `ProductService` escribe
 * aquí; los componentes leen.
 */
@Injectable({ providedIn: "root" })
export class ProductModel {
  readonly list = signal<ProductResponse[]>([]);
  readonly editing = signal<ProductResponse | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
