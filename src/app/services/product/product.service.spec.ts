import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService } from "primeng/api";
import { of, throwError } from "rxjs";
import { ProductService } from "./product.service";
import { ProductDao } from "../../DAO/product/product.dao";
import { ProductResponse } from "../../DTO/product.dto";
import { CrudComponent } from "../../model/Domain/crud-component";

describe("ProductService", () => {
  let service: ProductService;
  let dao: ProductDao;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), MessageService],
    });
    service = TestBed.inject(ProductService);
    dao = TestBed.inject(ProductDao);
  });

  const product: ProductResponse = { id: 1, name: "Leche", barcode: "123", price: 1.5, category: "Lacteos" };

  it("creates a product, appends it to the list and notifies the component", () => {
    jest.spyOn(dao, "create").mockReturnValue(of(product));
    const component: CrudComponent = { afterSave: jest.fn() };

    service.save({ name: product.name, price: product.price }, undefined, component);

    expect(service.model.list()).toEqual([product]);
    expect(component.afterSave).toHaveBeenCalled();
  });

  it("sets a readable error and stops loading when saving fails", () => {
    jest.spyOn(dao, "update").mockReturnValue(throwError(() => ({ status: 400 })));

    service.save({ name: product.name, price: product.price }, 1);

    expect(service.model.loading()).toBe(false);
    expect(service.model.error()).toBeTruthy();
  });

  it("restores the list when a delete fails after the optimistic removal", () => {
    service.model.list.set([product]);
    jest.spyOn(dao, "delete").mockReturnValue(throwError(() => ({ status: 500 })));

    service.delete(1);

    expect(service.model.list()).toEqual([product]);
  });
});
