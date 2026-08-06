import { Injectable, signal } from "@angular/core";
import {
  SalesSummaryResponse,
  SalesByBranchDTO,
  SalesByCashierDTO,
  InventoryStatusResponse,
  SalesByProductDTO,
  SalesComparisonResponse,
  ProductPerformanceDTO,
  CashRegisterReportResponse,
} from "../../DTO/report.dto";

@Injectable({ providedIn: "root" })
export class ReportModel {
  readonly summary = signal<SalesSummaryResponse | null>(null);
  readonly byBranch = signal<SalesByBranchDTO[]>([]);
  readonly byCashier = signal<SalesByCashierDTO[]>([]);
  readonly inventoryStatus = signal<InventoryStatusResponse | null>(null);
  readonly byProduct = signal<SalesByProductDTO[]>([]);
  readonly comparison = signal<SalesComparisonResponse | null>(null);
  readonly performance = signal<ProductPerformanceDTO[]>([]);
  readonly cashRegisterReport = signal<CashRegisterReportResponse | null>(null);
  readonly loading = signal(false);
}
