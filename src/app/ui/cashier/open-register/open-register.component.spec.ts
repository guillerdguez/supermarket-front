import { TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService, ConfirmationService } from "primeng/api";
import { OpenRegisterComponent } from "./open-register.component";
import { CashRegisterService } from "../../../services/cash-register/cash-register.service";
import { BranchService } from "../../../services/branch/branch.service";
import { AuthService } from "../../../services/auth/auth.service";
import { UserResponse } from "../../../DTO/auth.dto";

describe("OpenRegisterComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenRegisterComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();
  });

  function create() {
    const fixture = TestBed.createComponent(OpenRegisterComponent);
    fixture.detectChanges();
    return fixture;
  }

  function setUser(partial: Partial<UserResponse>) {
    const auth = TestBed.inject(AuthService);
    auth.model.currentUser.set({
      id: 1,
      username: "cashier1",
      email: "cashier@supermarket.com",
      firstName: "John",
      lastName: "Cashier",
      role: "CASHIER",
      branchId: null,
      branchName: null,
      ...partial,
    });
  }

  it("should create", () => {
    const fixture = create();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("loads the branch list on init when the user has no assigned branch (admin/manager)", () => {
    setUser({ branchId: null });
    const branches = TestBed.inject(BranchService);
    const retrieveSpy = jest.spyOn(branches, "retrieveList").mockImplementation(() => undefined);

    create();

    expect(retrieveSpy).toHaveBeenCalled();
  });

  it("does not load the branch list on init when the user already has an assigned branch", () => {
    setUser({ branchId: 1, branchName: "Sucursal Centro" });
    const branches = TestBed.inject(BranchService);
    const retrieveSpy = jest.spyOn(branches, "retrieveList").mockImplementation(() => undefined);

    create();

    expect(retrieveSpy).not.toHaveBeenCalled();
  });

  it("rejects a negative opening balance", () => {
    setUser({ branchId: 1 });
    const fixture = create();
    const cash = TestBed.inject(CashRegisterService);
    const openSpy = jest.spyOn(cash, "open").mockImplementation(() => undefined);

    fixture.componentInstance.form.openingBalance = -10;
    fixture.componentInstance.onSubmit();

    expect(openSpy).not.toHaveBeenCalled();
  });

  it("rejects submitting without a branch when the user has none assigned", () => {
    setUser({ branchId: null });
    const fixture = create();
    const cash = TestBed.inject(CashRegisterService);
    const openSpy = jest.spyOn(cash, "open").mockImplementation(() => undefined);

    fixture.componentInstance.form.openingBalance = 100;
    fixture.componentInstance.form.branchId = undefined;
    fixture.componentInstance.onSubmit();

    expect(openSpy).not.toHaveBeenCalled();
  });

  it("opens the register using the user's assigned branch, ignoring any branchId in the form", () => {
    setUser({ branchId: 1, branchName: "Sucursal Centro" });
    const fixture = create();
    const cash = TestBed.inject(CashRegisterService);
    const openSpy = jest.spyOn(cash, "open").mockImplementation(() => undefined);

    fixture.componentInstance.form.openingBalance = 150;
    fixture.componentInstance.onSubmit();

    expect(openSpy).toHaveBeenCalledWith({ openingBalance: 150 }, fixture.componentInstance);
  });

  it("opens the register with the chosen branchId when the user has none assigned", () => {
    setUser({ branchId: null });
    const fixture = create();
    const cash = TestBed.inject(CashRegisterService);
    const openSpy = jest.spyOn(cash, "open").mockImplementation(() => undefined);

    fixture.componentInstance.form.openingBalance = 200;
    fixture.componentInstance.form.branchId = 3;
    fixture.componentInstance.onSubmit();

    expect(openSpy).toHaveBeenCalledWith(
      { branchId: 3, openingBalance: 200 },
      fixture.componentInstance,
    );
  });

  it("navigates to the cashier dashboard after a successful save", () => {
    setUser({ branchId: 1 });
    const fixture = create();
    const router = TestBed.inject(Router);
    const navSpy = jest.spyOn(router, "navigateByUrl").mockResolvedValue(true);

    fixture.componentInstance.afterSave();

    expect(navSpy).toHaveBeenCalledWith("/cashier/dashboard");
  });
});
