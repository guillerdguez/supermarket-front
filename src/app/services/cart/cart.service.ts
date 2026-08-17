import { Injectable, inject } from "@angular/core";
import { ProductResponse } from "../../DTO/product.dto";
import { CartModel } from "../../model/Domain/cart.model";

@Injectable({ providedIn: "root" })
export class CartService {
  readonly model = inject(CartModel);

  add(product: ProductResponse) {
    this.model.items.update((items) => {
      const ex = items.find((i) => i.product.id === product.id);
      if (ex) return items.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...items, { product, quantity: 1 }];
    });
  }
  increase(id: number) {
    this.model.items.update((items) => items.map((i) => (i.product.id === id ? { ...i, quantity: i.quantity + 1 } : i)));
  }
  decrease(id: number) {
    this.model.items.update((items) =>
      items.map((i) => (i.product.id === id ? { ...i, quantity: i.quantity - 1 } : i)).filter((i) => i.quantity > 0),
    );
  }
  remove(id: number) {
    this.model.items.update((items) => items.filter((i) => i.product.id !== id));
  }
  clear() {
    this.model.items.set([]);
  }
}
