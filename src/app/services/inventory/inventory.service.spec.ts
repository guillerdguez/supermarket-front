import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService } from "primeng/api";
import { of, throwError } from "rxjs";
import { InventoryService } from "./inventory.service";
import { InventoryDao } from "../../DAO/inventory/inventory.dao";
import { BranchInventoryResponse } from "../../DTO/inventory.dto";
import { MessageProcessingService } from "../../../util/messageProcessingCenter/message-processing.service";

describe("InventoryService", () => {
  let service: InventoryService;
  let dao: InventoryDao;
  let messages: MessageProcessingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), MessageService],
    });
    service = TestBed.inject(InventoryService);
    dao = TestBed.inject(InventoryDao);
    messages = TestBed.inject(MessageProcessingService);
  });

  const line: BranchInventoryResponse = {
    id: 1, branchId: 1, branchName: "Centro", productId: 1, productName: "Leche",
    productCategory: "Lacteos", stock: 2, minStock: 5,
  };

  it("adjustStock warns when the new stock is at or below the minimum", () => {
    jest.spyOn(dao, "adjustStock").mockReturnValue(of(line));
    const warnSpy = jest.spyOn(messages, "publishWarnMsg");
    service.model.list.set([{ ...line, stock: 10 }]);

    service.adjustStock(1, 1, { delta: -8 });

    expect(service.model.list()).toEqual([line]);
    expect(warnSpy).toHaveBeenCalled();
  });

  it("adjustStock confirms success when the new stock is above the minimum", () => {
    const restocked = { ...line, stock: 20 };
    jest.spyOn(dao, "adjustStock").mockReturnValue(of(restocked));
    const successSpy = jest.spyOn(messages, "publishSuccessMsg");
    service.model.list.set([line]);

    service.adjustStock(1, 1, { delta: 18 });

    expect(service.model.list()).toEqual([restocked]);
    expect(successSpy).toHaveBeenCalled();
  });

  it("retrieveByBranch clears the list and sets a readable error on failure", () => {
    jest.spyOn(dao, "getByBranch").mockReturnValue(throwError(() => ({ status: 500 })));

    service.retrieveByBranch(1);

    expect(service.model.list()).toEqual([]);
    expect(service.model.error()).toBeTruthy();
    expect(service.model.loading()).toBe(false);
  });
});
