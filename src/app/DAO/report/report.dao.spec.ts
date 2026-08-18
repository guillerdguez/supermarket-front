import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { ReportDao } from "./report.dao";
import { RestPathService } from "../../../util/restPath/rest-path.service";

describe("ReportDao", () => {
  let dao: ReportDao;
  let controller: HttpTestingController;
  let url: RestPathService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    dao = TestBed.inject(ReportDao);
    controller = TestBed.inject(HttpTestingController);
    url = TestBed.inject(RestPathService);
  });

  afterEach(() => controller.verify());

  it("sends no query params when no filter is given", () => {
    dao.salesSummary().subscribe();

    const req = controller.expectOne((r) => r.url === url.reportsSalesSummary());
    expect(req.request.params.keys()).toEqual([]);
    req.flush({ totalRevenue: 0, transactionCount: 0, averageTicket: 0 });
  });

  it("sends only the filter fields that are set", () => {
    dao.salesByBranch({ startDate: "2026-01-01" }).subscribe();

    const req = controller.expectOne((r) => r.url === url.reportsSalesByBranch());
    expect(req.request.params.get("startDate")).toBe("2026-01-01");
    expect(req.request.params.has("endDate")).toBe(false);
    expect(req.request.params.has("branchId")).toBe(false);
    req.flush([]);
  });

  it("sends every filter field when all are set, including branchId 0", () => {
    dao.salesByCashier({ startDate: "2026-01-01", endDate: "2026-01-31", branchId: 0 }).subscribe();

    const req = controller.expectOne((r) => r.url === url.reportsSalesByCashier());
    expect(req.request.params.get("startDate")).toBe("2026-01-01");
    expect(req.request.params.get("endDate")).toBe("2026-01-31");
    expect(req.request.params.get("branchId")).toBe("0");
    req.flush([]);
  });

  it("inventoryStatus takes no filter", () => {
    dao.inventoryStatus().subscribe();

    const req = controller.expectOne((r) => r.url === url.reportsInventoryStatus());
    expect(req.request.params.keys()).toEqual([]);
    req.flush({
      totalProducts: 0,
      totalUnitsInStock: 0,
      totalInventoryValue: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
    });
  });

  it("salesByProduct forwards the filter", () => {
    dao.salesByProduct({ branchId: 3 }).subscribe();

    const req = controller.expectOne((r) => r.url === url.reportsSalesByProduct());
    expect(req.request.params.get("branchId")).toBe("3");
    req.flush([]);
  });

  it("salesComparison forwards the filter", () => {
    dao.salesComparison({ startDate: "2026-01-01" }).subscribe();

    const req = controller.expectOne((r) => r.url === url.reportsSalesComparison());
    expect(req.request.params.get("startDate")).toBe("2026-01-01");
    req.flush({
      currentPeriod: { startDate: "", endDate: "", totalRevenue: 0, transactionCount: 0, averageTicket: 0 },
      previousPeriod: { startDate: "", endDate: "", totalRevenue: 0, transactionCount: 0, averageTicket: 0 },
      growthPercentage: 0,
    });
  });

  it("productPerformance forwards the filter", () => {
    dao.productPerformance({ endDate: "2026-01-31" }).subscribe();

    const req = controller.expectOne((r) => r.url === url.reportsInventoryPerformance());
    expect(req.request.params.get("endDate")).toBe("2026-01-31");
    req.flush([]);
  });

  it("cashRegisterReport sends every filter field, including showOnlyDiscrepancies", () => {
    dao
      .cashRegisterReport({
        startDate: "2026-01-01",
        endDate: "2026-01-31",
        branchId: 2,
        showOnlyDiscrepancies: true,
      })
      .subscribe();

    const req = controller.expectOne((r) => r.url === url.reportsCashRegisters());
    expect(req.request.params.get("startDate")).toBe("2026-01-01");
    expect(req.request.params.get("endDate")).toBe("2026-01-31");
    expect(req.request.params.get("branchId")).toBe("2");
    expect(req.request.params.get("showOnlyDiscrepancies")).toBe("true");
    req.flush({ totalClosures: 0, totalSurplus: 0, totalShortage: 0, discrepancies: [] });
  });

  it("cashRegisterReport sends showOnlyDiscrepancies explicitly when set to false", () => {
    dao.cashRegisterReport({ showOnlyDiscrepancies: false }).subscribe();

    const req = controller.expectOne((r) => r.url === url.reportsCashRegisters());
    expect(req.request.params.get("showOnlyDiscrepancies")).toBe("false");
    req.flush({ totalClosures: 0, totalSurplus: 0, totalShortage: 0, discrepancies: [] });
  });

  it("cashRegisterReport omits showOnlyDiscrepancies when not provided", () => {
    dao.cashRegisterReport({ startDate: "2026-01-01" }).subscribe();

    const req = controller.expectOne((r) => r.url === url.reportsCashRegisters());
    expect(req.request.params.has("showOnlyDiscrepancies")).toBe(false);
    req.flush({ totalClosures: 0, totalSurplus: 0, totalShortage: 0, discrepancies: [] });
  });

  it("skips a filter field that is explicitly null", () => {
    dao.salesSummary({ startDate: null } as unknown as { startDate: string }).subscribe();

    const req = controller.expectOne((r) => r.url === url.reportsSalesSummary());
    expect(req.request.params.has("startDate")).toBe(false);
    req.flush({ totalRevenue: 0, transactionCount: 0, averageTicket: 0 });
  });
});
