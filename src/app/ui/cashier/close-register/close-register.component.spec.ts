import { TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService, ConfirmationService } from "primeng/api";
import { CloseRegisterComponent } from "./close-register.component";
import { CashRegisterService } from "../../../services/cash-register/cash-register.service";
import { AuthService } from "../../../services/auth/auth.service";
import { CashRegisterResponse } from "../../../DTO/cash-register.dto";
import { UserResponse } from "../../../DTO/auth.dto";

describe("CloseRegisterComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseRegisterComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();
  });

  function setUser(partial: Partial<UserResponse>) {
    const auth = TestBed.inject(AuthService);
    auth.model.currentUser.set({
      id: 3,
      username: "cashier1",
      email: "cashier@supermarket.com",
      firstName: "John",
      lastName: "Cashier",
      role: "CASHIER",
      branchId: 1,
      branchName: "Sucursal Centro",
      ...partial,
    });
  }

  const openRegister: CashRegisterResponse = {
    id: 10,
    branchId: 1,
    openingBalance: 150,
    status: "OPEN",
  };

  function create() {
    const fixture = TestBed.createComponent(CloseRegisterComponent);
    fixture.detectChanges();
    return fixture;
  }

  it("should create", () => {
    setUser({});
    const fixture = create();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("fetches the current register on init when none is loaded and the branch is known", () => {
    setUser({ branchId: 1 });
    const cash = TestBed.inject(CashRegisterService);
    const retrieveSpy = jest.spyOn(cash, "retrieveCurrent").mockImplementation(() => undefined);

    create();

    expect(retrieveSpy).toHaveBeenCalledWith(1);
  });

  it("does not re-fetch the current register when one is already loaded", () => {
    setUser({ branchId: 1 });
    const cash = TestBed.inject(CashRegisterService);
    cash.model.current.set(openRegister);
    const retrieveSpy = jest.spyOn(cash, "retrieveCurrent").mockImplementation(() => undefined);

    create();

    expect(retrieveSpy).not.toHaveBeenCalled();
  });

  it("rejects submitting without an open register", () => {
    setUser({});
    const fixture = create();
    const cash = TestBed.inject(CashRegisterService);
    const closeSpy = jest.spyOn(cash, "close").mockImplementation(() => undefined);

    fixture.componentInstance.form.controls.closingBalance.setValue(200);
    fixture.componentInstance.onSubmit();

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it("rejects a negative closing balance", () => {
    setUser({});
    const fixture = create();
    const cash = TestBed.inject(CashRegisterService);
    cash.model.current.set(openRegister);
    const closeSpy = jest.spyOn(cash, "close").mockImplementation(() => undefined);

    fixture.componentInstance.form.controls.closingBalance.setValue(-5);
    fixture.componentInstance.onSubmit();

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it("closes the current register with the entered balance", () => {
    setUser({});
    const fixture = create();
    const cash = TestBed.inject(CashRegisterService);
    cash.model.current.set(openRegister);
    const closeSpy = jest.spyOn(cash, "close").mockImplementation(() => undefined);

    fixture.componentInstance.form.controls.closingBalance.setValue(320.5);
    fixture.componentInstance.onSubmit();

    expect(closeSpy).toHaveBeenCalledWith(
      10,
      { closingBalance: 320.5 },
      fixture.componentInstance,
    );
  });

  it("navigates to the cashier dashboard after a successful save", () => {
    setUser({});
    const fixture = create();
    const router = TestBed.inject(Router);
    const navSpy = jest.spyOn(router, "navigateByUrl").mockResolvedValue(true);

    fixture.componentInstance.afterSave();

    expect(navSpy).toHaveBeenCalledWith("/pos");
  });
});
