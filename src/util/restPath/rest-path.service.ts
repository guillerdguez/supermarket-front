import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class RestPathService {
  private readonly base = `${environment.apiUrl}/api`;

  authLogin(): string {
    return `${this.base}/auth/login`;
  }

  authLogout(): string {
    return `${this.base}/auth/logout`;
  }

  productsCrud(id?: number): string {
    return id != null ? `${this.base}/products/${id}` : `${this.base}/products`;
  }

  branchesCrud(id?: number): string {
    return id != null ? `${this.base}/branches/${id}` : `${this.base}/branches`;
  }

  usersCrud(id?: number): string {
    return id != null ? `${this.base}/users/${id}` : `${this.base}/users`;
  }

  userActivate(id: number): string {
    return `${this.base}/users/${id}/activate`;
  }

  userChangeRole(id: number): string {
    return `${this.base}/users/${id}/role`;
  }

  profileCrud(): string {
    return `${this.base}/profile`;
  }

  profileChangePassword(): string {
    return `${this.base}/profile/change-password`;
  }

  cashRegistersCrud(): string {
    return `${this.base}/cash-registers`;
  }

  cashRegisterOpen(): string {
    return `${this.base}/cash-registers/open`;
  }

  cashRegisterClose(id: number): string {
    return `${this.base}/cash-registers/${id}/close`;
  }

  cashRegisterCurrent(branchId: number): string {
    return `${this.base}/cash-registers/branches/${branchId}/current`;
  }

  salesCrud(id?: number): string {
    return id != null ? `${this.base}/sales/${id}` : `${this.base}/sales`;
  }

  saleCancel(id: number): string {
    return `${this.base}/sales/${id}/cancel`;
  }

  paymentsCrud(): string {
    return `${this.base}/payments`;
  }

  cashierMySales(): string {
    return `${this.base}/cashier/my-sales`;
  }

  cashierMySaleDetail(id: number): string {
    return `${this.base}/cashier/my-sales/${id}`;
  }

  transfersCrud(id?: number): string {
    return id != null ? `${this.base}/transfers/${id}` : `${this.base}/transfers`;
  }

  transfersMine(): string {
    return `${this.base}/transfers/mine`;
  }

  transferApprove(id: number): string {
    return `${this.base}/transfers/${id}/approve`;
  }

  transferReject(id: number): string {
    return `${this.base}/transfers/${id}/reject`;
  }

  transferComplete(id: number): string {
    return `${this.base}/transfers/${id}/complete`;
  }

  transferCancel(id: number): string {
    return `${this.base}/transfers/${id}/cancel`;
  }

  inventoryByBranch(branchId: number): string {
    return `${this.base}/inventory/branches/${branchId}/inventory`;
  }

  inventoryLowStock(): string {
    return `${this.base}/inventory/low-stock`;
  }

  inventoryLowStockByBranch(branchId: number): string {
    return `${this.base}/inventory/branches/${branchId}/low-stock`;
  }

  inventoryProduct(branchId: number, productId: number): string {
    return `${this.base}/inventory/branches/${branchId}/products/${productId}`;
  }

  inventoryProductAdjust(branchId: number, productId: number): string {
    return `${this.inventoryProduct(branchId, productId)}/adjust`;
  }

  notificationsAll(): string {
    return `${this.base}/notifications/all`;
  }

  notificationsCrud(id: number): string {
    return `${this.base}/notifications/${id}`;
  }

  notificationRead(id: number): string {
    return `${this.base}/notifications/${id}/read`;
  }

  notificationsMarkAllRead(): string {
    return `${this.base}/notifications/mark-all-read`;
  }

  reportsSalesSummary(): string {
    return `${this.base}/reports/sales/summary`;
  }

  reportsSalesByBranch(): string {
    return `${this.base}/reports/sales/by-branch`;
  }

  reportsSalesByCashier(): string {
    return `${this.base}/reports/sales/by-cashier`;
  }

  reportsInventoryStatus(): string {
    return `${this.base}/reports/inventory/status`;
  }

  reportsSalesByProduct(): string {
    return `${this.base}/reports/sales/by-product`;
  }

  reportsSalesComparison(): string {
    return `${this.base}/reports/sales/comparison`;
  }

  reportsInventoryPerformance(): string {
    return `${this.base}/reports/inventory/performance`;
  }

  reportsCashRegisters(): string {
    return `${this.base}/reports/cash-registers`;
  }

  auditCrud(id?: number): string {
    return id != null ? `${this.base}/audit-logs/${id}` : `${this.base}/audit-logs`;
  }
}
