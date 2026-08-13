import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService } from "primeng/api";
import { of, throwError } from "rxjs";
import { SaleService } from "./sale.service";
import { SaleDao } from "../../DAO/sale/sale.dao";
import { SaleRequest, SaleResponse } from "../../DTO/sale.dto";
import { CrudComponent } from "../../model/Domain/crud-component";

describe("SaleService", () => {
  let service: SaleService;
  let dao: SaleDao;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), MessageService],
    });
    service = TestBed.inject(SaleService);
    dao = TestBed.inject(SaleDao);
  });

  const request: SaleRequest = {
    branchId: 1,
    details: [{ productId: 1, quantity: 2 }],
  };

  const sale: SaleResponse = { id: 100, total: 2.3, status: "REGISTERED", branchId: 1 };

  it("registers the payment after the sale is created, then prepends it to the list and notifies the component", () => {
    const createSpy = jest.spyOn(dao, "create").mockReturnValue(of(sale));
    const paymentSpy = jest.spyOn(dao, "registerPayment").mockReturnValue(of({}));
    const component: CrudComponent = { afterSave: jest.fn() };

    service.save(request, "CASH", 2.3, component);

    expect(createSpy).toHaveBeenCalledWith(request);
    expect(paymentSpy).toHaveBeenCalledWith({ saleId: 100, amount: 2.3, paymentType: "CASH" });
    expect(service.model.list()).toEqual([sale]);
    expect(service.model.loading()).toBe(false);
    expect(component.afterSave).toHaveBeenCalled();
  });

  it("sets a readable error and stops loading when creating the sale fails", () => {
    jest.spyOn(dao, "create").mockReturnValue(throwError(() => ({ status: 400 })));
    const paymentSpy = jest.spyOn(dao, "registerPayment");
    const component: CrudComponent = { afterSave: jest.fn() };

    service.save(request, "CASH", 2.3, component);

    expect(paymentSpy).not.toHaveBeenCalled();
    expect(service.model.loading()).toBe(false);
    expect(service.model.error()).toBeTruthy();
    expect(component.afterSave).not.toHaveBeenCalled();
  });

  it("does not call afterSave when the sale was created but the payment registration fails, so the cart/dialog stay open for a retry", () => {
    jest.spyOn(dao, "create").mockReturnValue(of(sale));
    jest.spyOn(dao, "registerPayment").mockReturnValue(throwError(() => ({ status: 400 })));
    const component: CrudComponent = { afterSave: jest.fn() };

    service.save(request, "CARD", 2.3, component);

    expect(component.afterSave).not.toHaveBeenCalled();
    expect(service.model.loading()).toBe(false);
  });

  it("cancels a sale and replaces it in the list with the cancelled version", () => {
    const cancelled: SaleResponse = { ...sale, status: "CANCELLED" };
    jest.spyOn(dao, "cancel").mockReturnValue(of(cancelled));
    service.model.list.set([sale]);
    const component: CrudComponent = { afterSave: jest.fn() };

    service.cancel(100, "Cliente cambio de opinion", component);

    expect(service.model.list()).toEqual([cancelled]);
    expect(component.afterSave).toHaveBeenCalled();
  });
});
