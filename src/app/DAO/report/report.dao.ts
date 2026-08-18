import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  ReportFilterRequest,
  SalesSummaryResponse,
  SalesByBranchDTO,
  SalesByCashierDTO,
  InventoryStatusResponse,
  SalesByProductDTO,
  SalesComparisonResponse,
  ProductPerformanceDTO,
  CashRegisterReportResponse,
  CashRegisterFilterRequest,
} from "../../DTO/report.dto";
import { RestPathService } from "../../../util/restPath/rest-path.service";

@Injectable({ providedIn: "root" })
export class ReportDao {
  private readonly http = inject(HttpClient);
  private readonly url = inject(RestPathService);

  private toParams<T extends object>(filter?: T): HttpParams {
    let params = new HttpParams();
    if (!filter) return params;
    for (const [key, value] of Object.entries(filter)) {
      if (value !== null && value !== undefined) params = params.set(key, value);
    }
    return params;
  }

  salesSummary(filter?: ReportFilterRequest): Observable<SalesSummaryResponse> {
    return this.http.get<SalesSummaryResponse>(this.url.reportsSalesSummary(), {
      params: this.toParams(filter),
    });
  }

  salesByBranch(filter?: ReportFilterRequest): Observable<SalesByBranchDTO[]> {
    return this.http.get<SalesByBranchDTO[]>(this.url.reportsSalesByBranch(), {
      params: this.toParams(filter),
    });
  }

  salesByCashier(filter?: ReportFilterRequest): Observable<SalesByCashierDTO[]> {
    return this.http.get<SalesByCashierDTO[]>(this.url.reportsSalesByCashier(), {
      params: this.toParams(filter),
    });
  }

  inventoryStatus(): Observable<InventoryStatusResponse> {
    return this.http.get<InventoryStatusResponse>(this.url.reportsInventoryStatus());
  }

  salesByProduct(filter?: ReportFilterRequest): Observable<SalesByProductDTO[]> {
    return this.http.get<SalesByProductDTO[]>(this.url.reportsSalesByProduct(), {
      params: this.toParams(filter),
    });
  }

  salesComparison(filter?: ReportFilterRequest): Observable<SalesComparisonResponse> {
    return this.http.get<SalesComparisonResponse>(this.url.reportsSalesComparison(), {
      params: this.toParams(filter),
    });
  }

  productPerformance(filter?: ReportFilterRequest): Observable<ProductPerformanceDTO[]> {
    return this.http.get<ProductPerformanceDTO[]>(this.url.reportsInventoryPerformance(), {
      params: this.toParams(filter),
    });
  }

  cashRegisterReport(filter?: CashRegisterFilterRequest): Observable<CashRegisterReportResponse> {
    return this.http.get<CashRegisterReportResponse>(this.url.reportsCashRegisters(), {
      params: this.toParams(filter),
    });
  }
}
