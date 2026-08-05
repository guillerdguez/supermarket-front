import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService } from "primeng/api";
import { of, throwError } from "rxjs";
import { TransferService } from "./transfer.service";
import { TransferDao } from "../../DAO/transfer/transfer.dao";
import { TransferResponse } from "../../DTO/transfer.dto";
import { CrudComponent } from "../../model/Domain/crud-component";

describe("TransferService", () => {
  let service: TransferService;
  let dao: TransferDao;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), MessageService],
    });
    service = TestBed.inject(TransferService);
    dao = TestBed.inject(TransferDao);
  });

  const pending: TransferResponse = {
    id: 1, sourceBranchId: 6, targetBranchId: 1, productId: 1, quantity: 10, status: "PENDING",
  };

  function withPendingInList() {
    service.model.list.set([pending]);
  }

  it("requesting a transfer prepends it to the list", () => {
    const created = { ...pending, id: 2 };
    jest.spyOn(dao, "request").mockReturnValue(of(created));
    const component: CrudComponent = { afterSave: jest.fn() };

    service.save(
      { sourceBranchId: 6, targetBranchId: 1, productId: 1, quantity: 10 },
      component,
    );

    expect(service.model.list()).toEqual([created]);
    expect(component.afterSave).toHaveBeenCalled();
    expect(service.model.loading()).toBe(false);
  });

  it("sets a readable error when the transfer request fails", () => {
    jest.spyOn(dao, "request").mockReturnValue(throwError(() => ({ status: 400 })));

    service.save({ sourceBranchId: 6, targetBranchId: 1, productId: 1, quantity: 10 });

    expect(service.model.error()).toBeTruthy();
    expect(service.model.loading()).toBe(false);
  });

  it("approve() replaces the transfer in the list with the approved version", () => {
    withPendingInList();
    const approved: TransferResponse = { ...pending, status: "APPROVED" };
    jest.spyOn(dao, "approve").mockReturnValue(of(approved));
    const component: CrudComponent = { afterSave: jest.fn() };

    service.approve(1, component);

    expect(service.model.list()).toEqual([approved]);
    expect(component.afterSave).toHaveBeenCalled();
  });

  it("reject() sends the reason and replaces the transfer with the rejected version", () => {
    withPendingInList();
    const rejected: TransferResponse = { ...pending, status: "REJECTED", rejectionReason: "Sin stock" };
    const rejectSpy = jest.spyOn(dao, "reject").mockReturnValue(of(rejected));

    service.reject(1, "Sin stock");

    expect(rejectSpy).toHaveBeenCalledWith(1, { reason: "Sin stock" });
    expect(service.model.list()).toEqual([rejected]);
  });

  it("complete() replaces the transfer in the list with the completed version", () => {
    withPendingInList();
    const completed: TransferResponse = { ...pending, status: "COMPLETED" };
    jest.spyOn(dao, "complete").mockReturnValue(of(completed));

    service.complete(1);

    expect(service.model.list()).toEqual([completed]);
  });

  it("cancel() replaces the transfer in the list with the cancelled version", () => {
    withPendingInList();
    const cancelled: TransferResponse = { ...pending, status: "CANCELLED" };
    jest.spyOn(dao, "cancel").mockReturnValue(of(cancelled));

    service.cancel(1);

    expect(service.model.list()).toEqual([cancelled]);
  });

  it("leaves the list untouched when a status change fails", () => {
    withPendingInList();
    jest.spyOn(dao, "approve").mockReturnValue(throwError(() => ({ status: 400 })));

    service.approve(1);

    expect(service.model.list()).toEqual([pending]);
  });
});
