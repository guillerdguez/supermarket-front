import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  ReportFilterRequest,
  SalesSummaryResponse,
  SalesByBranchDTO,
  SalesByCashierDTO,
  InventoryStatusResponse,
} from "../../DTO/report.dto";
import { RestPathService } from "../../../util/restPath/rest-path.service";

@Injectable({ providedIn: "root" })
export class ReportDao {
  private readonly http = inject(HttpClient);
  private readonly url = inject(RestPathService);

  private toParams(filter?: ReportFilterRequest): HttpParams {
    let params = new HttpParams();
    if (!filter) return params;
    if (filter.startDate) params = params.set("startDate", filter.startDate);
    if (filter.endDate) params = params.set("endDate", filter.endDate);
    if (filter.branchId != null) params = params.set("branchId", filter.branchId);
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
}
