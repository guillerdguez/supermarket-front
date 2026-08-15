import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService, ConfirmationService } from "primeng/api";
import { AdminDashboardComponent } from "./dashboard.component";
import { ReportService } from "../../../services/report/report.service";
import { InventoryService } from "../../../services/inventory/inventory.service";
import { CashRegisterService } from "../../../services/cash-register/cash-register.service";
import { CashRegisterResponse } from "../../../DTO/cash-register.dto";
import { SalesByBranchDTO } from "../../../DTO/report.dto";

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
    jest.spyOn(reports, "retrieveSales").mockImplementation(() => undefined);
    jest.spyOn(reports, "retrieveInventoryStatus").mockImplementation(() => undefined);
    jest.spyOn(inventory, "retrieveLowStock").mockImplementation(() => undefined);
    jest.spyOn(cash, "retrieveList").mockImplementation(() => undefined);
    return { reports, inventory, cash };
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
    const { reports, inventory, cash } = stubRetrieves();
    const fixture = create();

    expect(fixture.componentInstance).toBeTruthy();
    expect(reports.retrieveSales).toHaveBeenCalled();
    expect(reports.retrieveInventoryStatus).toHaveBeenCalled();
    expect(inventory.retrieveLowStock).toHaveBeenCalled();
    expect(cash.retrieveList).toHaveBeenCalled();
  });

  it("ranks branches by revenue and keeps only the top 5", () => {
    stubRetrieves();
    const fixture = create();
    const reports = TestBed.inject(ReportService);
    const byBranch: SalesByBranchDTO[] = [
      { branchId: 1, branchName: "Centro", totalRevenue: 100, transactionCount: 10 },
      { branchId: 2, branchName: "Ruzafa", totalRevenue: 300, transactionCount: 20 },
      { branchId: 3, branchName: "Benimaclet", totalRevenue: 200, transactionCount: 15 },
      { branchId: 4, branchName: "Patraix", totalRevenue: 50, transactionCount: 5 },
      { branchId: 5, branchName: "Malvarrosa", totalRevenue: 400, transactionCount: 25 },
      { branchId: 6, branchName: "Almacen", totalRevenue: 10, transactionCount: 1 },
    ];
    reports.model.byBranch.set(byBranch);

    expect(fixture.componentInstance.topBranches().map((b) => b.branchId)).toEqual([
      5, 2, 3, 1, 4,
    ]);
  });

  it("filters the register list down to the open ones", () => {
    stubRetrieves();
    const fixture = create();
    const cash = TestBed.inject(CashRegisterService);
    cash.model.list.set(registers);

    expect(fixture.componentInstance.openRegisters().map((r) => r.id)).toEqual([1, 3]);
  });

});
