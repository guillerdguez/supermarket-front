import { Injectable, signal, computed } from "@angular/core";
import { ProductResponse } from "../../DTO/product.dto";
export interface CartItem { product: ProductResponse; quantity: number; }
@Injectable({ providedIn: "root" })
export class CartService {
  readonly #items = signal<CartItem[]>([]);
  readonly items = this.#items.asReadonly();
  readonly itemCount = computed(() => this.#items().reduce((a, i) => a + i.quantity, 0));
  readonly total = computed(() => this.#items().reduce((a, i) => a + i.product.price * i.quantity, 0));
  add(product: ProductResponse) {
    this.#items.update((items) => {
      const ex = items.find((i) => i.product.id === product.id);
      if (ex) return items.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...items, { product, quantity: 1 }];
    });
  }
  increase(id: number) { this.#items.update((items) => items.map((i) => (i.product.id === id ? { ...i, quantity: i.quantity + 1 } : i))); }
  decrease(id: number) {
    this.#items.update((items) => items.map((i) => (i.product.id === id ? { ...i, quantity: i.quantity - 1 } : i)).filter((i) => i.quantity > 0));
  }
  remove(id: number) { this.#items.update((items) => items.filter((i) => i.product.id !== id)); }
  clear() { this.#items.set([]); }
}
