import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  BranchInventoryResponse,
  LowStockAlertResponse,
  InventoryStatusResponse,
  StockAdjustmentRequest,
  StockUpdateRequest,
} from "../../DTO/inventory.dto";
import { RestPathService } from "../../../util/restPath/rest-path.service";

@Injectable({ providedIn: "root" })
export class InventoryDao {
  private readonly http = inject(HttpClient);
  private readonly url = inject(RestPathService);

  getByBranch(branchId: number): Observable<BranchInventoryResponse[]> {
    return this.http.get<BranchInventoryResponse[]>(this.url.inventoryByBranch(branchId));
  }

  getLowStock(): Observable<LowStockAlertResponse[]> {
    return this.http.get<LowStockAlertResponse[]>(this.url.inventoryLowStock());
  }

  getLowStockByBranch(branchId: number): Observable<LowStockAlertResponse[]> {
    return this.http.get<LowStockAlertResponse[]>(this.url.inventoryLowStockByBranch(branchId));
  }

  getStatus(): Observable<InventoryStatusResponse> {
    return this.http.get<InventoryStatusResponse>(this.url.reportsInventoryStatus());
  }

  updateStock(
    branchId: number,
    productId: number,
    body: StockUpdateRequest,
  ): Observable<BranchInventoryResponse> {
    return this.http.put<BranchInventoryResponse>(
      this.url.inventoryProduct(branchId, productId),
      body,
    );
  }

  adjustStock(
    branchId: number,
    productId: number,
    body: StockAdjustmentRequest,
  ): Observable<BranchInventoryResponse> {
    return this.http.patch<BranchInventoryResponse>(
      this.url.inventoryProductAdjust(branchId, productId),
      body,
    );
  }
}
