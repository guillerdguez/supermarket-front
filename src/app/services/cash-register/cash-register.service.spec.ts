import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService } from "primeng/api";
import { of, throwError } from "rxjs";
import { CashRegisterService } from "./cash-register.service";
import { CashRegisterDao } from "../../DAO/cash-register/cash-register.dao";
import { CashRegisterResponse } from "../../DTO/cash-register.dto";
import { CrudComponent } from "../../model/Domain/crud-component";

describe("CashRegisterService", () => {
  let service: CashRegisterService;
  let dao: CashRegisterDao;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), MessageService],
    });
    service = TestBed.inject(CashRegisterService);
    dao = TestBed.inject(CashRegisterDao);
  });

  const register: CashRegisterResponse = { id: 1, branchId: 1, openingBalance: 100, status: "OPEN" };

  it("retrieveCurrent stores the open register and stops loading", () => {
    jest.spyOn(dao, "getCurrent").mockReturnValue(of(register));

    service.retrieveCurrent(1);

    expect(service.model.current()).toEqual(register);
    expect(service.model.loading()).toBe(false);
  });

  it("retrieveCurrent stays quiet on a 404 (no register open yet)", () => {
    jest.spyOn(dao, "getCurrent").mockReturnValue(throwError(() => ({ status: 404 })));

    service.retrieveCurrent(1);

    expect(service.model.current()).toBeNull();
    expect(service.model.error()).toBeNull();
  });

  it("retrieveCurrent sets a readable error for failures other than 404", () => {
    jest.spyOn(dao, "getCurrent").mockReturnValue(throwError(() => ({ status: 500 })));

    service.retrieveCurrent(1);

    expect(service.model.error()).toBeTruthy();
  });

  it("open stores the opened register and notifies the component", () => {
    jest.spyOn(dao, "open").mockReturnValue(of(register));
    const component: CrudComponent = { afterSave: jest.fn() };

    service.open({ branchId: 1, openingBalance: 100 }, component);

    expect(service.model.current()).toEqual(register);
    expect(component.afterSave).toHaveBeenCalled();
  });
});
