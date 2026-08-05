import { TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService, ConfirmationService } from "primeng/api";
import { AdminDashboardComponent } from "./dashboard.component";
import { ReportService } from "../../../services/report/report.service";
import { InventoryService } from "../../../services/inventory/inventory.service";
import { CashRegisterService } from "../../../services/cash-register/cash-register.service";
import { BranchService } from "../../../services/branch/branch.service";
import { AuthService } from "../../../services/auth/auth.service";
import { CashRegisterResponse } from "../../../DTO/cash-register.dto";
import { UserResponse } from "../../../DTO/auth.dto";

describe("AdminDashboardComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();
  });

  afterEach(() => jest.restoreAllMocks());

  function stubRetrieves() {
    const reports = TestBed.inject(ReportService);
    const inventory = TestBed.inject(InventoryService);
    const cash = TestBed.inject(CashRegisterService);
    const branches = TestBed.inject(BranchService);
    jest.spyOn(reports, "retrieveSales").mockImplementation(() => undefined);
    jest.spyOn(reports, "retrieveInventoryStatus").mockImplementation(() => undefined);
    jest.spyOn(inventory, "retrieveLowStock").mockImplementation(() => undefined);
    jest.spyOn(cash, "retrieveList").mockImplementation(() => undefined);
    jest.spyOn(branches, "retrieveList").mockImplementation(() => undefined);
    return { reports, inventory, cash, branches };
  }

  function create() {
    const fixture = TestBed.createComponent(AdminDashboardComponent);
    fixture.detectChanges();
    return fixture;
  }

  const registers: CashRegisterResponse[] = [
    { id: 1, branchId: 1, openingBalance: 150, status: "OPEN" },
    { id: 2, branchId: 2, openingBalance: 150, closingBalance: 300, status: "CLOSED" },
    { id: 3, branchId: 3, openingBalance: 150, status: "OPEN" },
  ];

  it("should create and load every dashboard data source on init", () => {
    const { reports, inventory, cash, branches } = stubRetrieves();
    const fixture = create();

    expect(fixture.componentInstance).toBeTruthy();
    expect(reports.retrieveSales).toHaveBeenCalled();
    expect(reports.retrieveInventoryStatus).toHaveBeenCalled();
    expect(inventory.retrieveLowStock).toHaveBeenCalled();
    expect(cash.retrieveList).toHaveBeenCalled();
    expect(branches.retrieveList).toHaveBeenCalled();
  });

  it("filters the register list down to the open ones", () => {
    stubRetrieves();
    const fixture = create();
    const cash = TestBed.inject(CashRegisterService);
    cash.model.list.set(registers);

    expect(fixture.componentInstance.openRegisters().map((r) => r.id)).toEqual([1, 3]);
  });

  it("greets by first name, falling back to the username", () => {
    stubRetrieves();
    const fixture = create();
    const auth = TestBed.inject(AuthService);

    auth.model.currentUser.set({
      id: 1, username: "admin", email: "a@a.com", firstName: "", lastName: "", role: "ADMIN",
    } as UserResponse);
    expect(fixture.componentInstance.firstName()).toBe("admin");
  });

  it("greets by first name when present", () => {
    stubRetrieves();
    const fixture = create();
    const auth = TestBed.inject(AuthService);

    auth.model.currentUser.set({
      id: 1, username: "admin", email: "a@a.com", firstName: "System", lastName: "Administrator", role: "ADMIN",
    });
    expect(fixture.componentInstance.firstName()).toBe("System");
  });

  it("picks a time-of-day greeting", () => {
    jest.spyOn(Date.prototype, "getHours").mockReturnValue(9);
    stubRetrieves();
    const fixture = create();

    expect(fixture.componentInstance.greeting()).toBe("Buenos días");
  });

  it("logs out and navigates to /login", () => {
    stubRetrieves();
    const fixture = create();
    const auth = TestBed.inject(AuthService);
    const router = TestBed.inject(Router);
    const logoutSpy = jest.spyOn(auth, "logout").mockImplementation(() => undefined);
    const navSpy = jest.spyOn(router, "navigate").mockResolvedValue(true);

    fixture.componentInstance.logout();

    expect(logoutSpy).toHaveBeenCalled();
    expect(navSpy).toHaveBeenCalledWith(["/login"]);
  });
});
