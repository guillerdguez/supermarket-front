import { TestBed } from "@angular/core/testing";
import { CartService } from "./cart.service";
import { ProductResponse } from "../../DTO/product.dto";

describe("CartService", () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  const product: ProductResponse = { id: 1, name: "Leche", barcode: "123", price: 1.5, category: "Lacteos" };

  it("adds a new product with quantity 1", () => {
    service.add(product);

    expect(service.model.items()).toEqual([{ product, quantity: 1 }]);
  });

  it("increments the quantity when adding a product already in the cart", () => {
    service.add(product);
    service.add(product);

    expect(service.model.items()).toEqual([{ product, quantity: 2 }]);
  });

  it("removes the line once its quantity reaches zero via decrease", () => {
    service.add(product);

    service.decrease(product.id);

    expect(service.model.items()).toEqual([]);
  });

  it("clear empties the cart", () => {
    service.add(product);

    service.clear();

    expect(service.model.items()).toEqual([]);
  });
});
