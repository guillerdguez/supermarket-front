import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService, ConfirmationService } from "primeng/api";
import { ReportComponent } from "./report.component";
import { ReportService } from "../../../services/report/report.service";
import { SalesByBranchDTO, SalesByCashierDTO } from "../../../DTO/report.dto";

describe("ReportComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportComponent],
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
    const svc = TestBed.inject(ReportService);
    jest.spyOn(svc, "retrieveSales").mockImplementation(() => undefined);
    jest.spyOn(svc, "retrieveInventoryStatus").mockImplementation(() => undefined);
    const fixture = TestBed.createComponent(ReportComponent);
    fixture.detectChanges();
    return { fixture, svc };
  }

  const byBranch: SalesByBranchDTO[] = [
    { branchId: 1, branchName: "Sucursal Centro", totalRevenue: 1350.59, transactionCount: 74 },
    { branchId: 2, branchName: "Sucursal Ruzafa", totalRevenue: 1172.69, transactionCount: 78 },
  ];

  const byCashier: SalesByCashierDTO[] = [
    { cashierId: 5, cashierUsername: "lfernandez", totalRevenue: 640.2, transactionCount: 30, averageTicket: 21.3 },
  ];

  it("should create and load sales + inventory data on init", () => {
    const { fixture, svc } = create();
    expect(fixture.componentInstance).toBeTruthy();
    expect(svc.retrieveSales).toHaveBeenCalledWith();
    expect(svc.retrieveInventoryStatus).toHaveBeenCalled();
  });

  it("builds the branch chart data from the byBranch signal", () => {
    const { fixture, svc } = create();
    svc.model.byBranch.set(byBranch);

    const data = fixture.componentInstance.branchChartData();

    expect(data.labels).toEqual(["Sucursal Centro", "Sucursal Ruzafa"]);
    expect(data.datasets[0].data).toEqual([1350.59, 1172.69]);
  });

  it("builds the cashier chart data from the byCashier signal", () => {
    const { fixture, svc } = create();
    svc.model.byCashier.set(byCashier);

    const data = fixture.componentInstance.cashierChartData();

    expect(data.labels).toEqual(["lfernandez"]);
    expect(data.datasets[0].data).toEqual([640.2]);
  });

  it("produces empty chart data when there are no rows", () => {
    const { fixture } = create();

    expect(fixture.componentInstance.branchChartData().labels).toEqual([]);
    expect(fixture.componentInstance.cashierChartData().datasets[0].data).toEqual([]);
  });

  it("filters sales by the selected date range", () => {
    const { fixture, svc } = create();
    fixture.componentInstance.startDate = "2026-07-01";
    fixture.componentInstance.endDate = "2026-07-31";

    fixture.componentInstance.onFilter();

    expect(svc.retrieveSales).toHaveBeenLastCalledWith({
      startDate: "2026-07-01",
      endDate: "2026-07-31",
    });
  });

  it("omits empty date fields from the filter", () => {
    const { fixture, svc } = create();
    fixture.componentInstance.startDate = "";
    fixture.componentInstance.endDate = "";

    fixture.componentInstance.onFilter();

    expect(svc.retrieveSales).toHaveBeenLastCalledWith({
      startDate: undefined,
      endDate: undefined,
    });
  });
});
