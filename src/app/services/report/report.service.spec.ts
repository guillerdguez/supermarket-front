import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MessageService } from "primeng/api";
import { of, throwError } from "rxjs";
import { ReportService } from "./report.service";
import { ReportDao } from "../../DAO/report/report.dao";
import { SalesSummaryResponse, CashRegisterReportResponse } from "../../DTO/report.dto";

describe("ReportService", () => {
  let service: ReportService;
  let dao: ReportDao;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), MessageService],
    });
    service = TestBed.inject(ReportService);
    dao = TestBed.inject(ReportDao);
  });

  const summary: SalesSummaryResponse = { totalRevenue: 100, transactionCount: 4, averageTicket: 25 };

  function mockSalesCalls() {
    jest.spyOn(dao, "salesSummary").mockReturnValue(of(summary));
    jest.spyOn(dao, "salesByBranch").mockReturnValue(of([]));
    jest.spyOn(dao, "salesByCashier").mockReturnValue(of([]));
    jest.spyOn(dao, "salesByProduct").mockReturnValue(of([]));
    jest.spyOn(dao, "productPerformance").mockReturnValue(of([]));
  }

  it("retrieveSales populates the summary and stops loading once every call resolves", () => {
    mockSalesCalls();
    jest.spyOn(dao, "salesComparison").mockReturnValue(
      of({
        currentPeriod: { startDate: "", endDate: "", totalRevenue: 0, transactionCount: 0, averageTicket: 0 },
        previousPeriod: { startDate: "", endDate: "", totalRevenue: 0, transactionCount: 0, averageTicket: 0 },
        growthPercentage: 0,
      }),
    );

    service.retrieveSales();

    expect(service.model.summary()).toEqual(summary);
    expect(service.model.loading()).toBe(false);
  });

  it("stops loading when any of the parallel calls fails", () => {
    mockSalesCalls();
    jest.spyOn(dao, "salesComparison").mockReturnValue(throwError(() => ({ status: 500 })));

    service.retrieveSales();

    expect(service.model.loading()).toBe(false);
  });

  it("retrieveCashRegisterReport stores the report on success", () => {
    const report: CashRegisterReportResponse = { totalClosures: 1, totalSurplus: 0, totalShortage: 0, discrepancies: [] };
    jest.spyOn(dao, "cashRegisterReport").mockReturnValue(of(report));

    service.retrieveCashRegisterReport();

    expect(service.model.cashRegisterReport()).toEqual(report);
  });
});
