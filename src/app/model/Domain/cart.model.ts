import { Injectable, signal, computed } from "@angular/core";
import { ProductResponse } from "../../DTO/product.dto";

export interface CartItem {
  product: ProductResponse;
  quantity: number;
}

@Injectable({ providedIn: "root" })
export class CartModel {
  readonly items = signal<CartItem[]>([]);
  readonly itemCount = computed(() => this.items().reduce((a, i) => a + i.quantity, 0));
  readonly total = computed(
    () => Math.round(this.items().reduce((a, i) => a + i.product.price * i.quantity, 0) * 100) / 100,
  );
}
