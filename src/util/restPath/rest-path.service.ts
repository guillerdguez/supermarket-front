import { Injectable } from "@angular/core";

/**
 * Única fuente de verdad de las URLs del backend. Los DAO nunca construyen
 * rutas a mano: piden aquí la que necesitan.
 *
 * Las rutas son relativas; `proxy.conf.json` las redirige al backend en
 * desarrollo.
 */
@Injectable({ providedIn: "root" })
export class RestPathService {
  // --- auth ---
  authLogin(): string {
    return "/api/auth/login";
  }

  authLogout(): string {
    return "/api/auth/logout";
  }

  // --- products ---
  productsCrud(id?: number): string {
    return id != null ? `/products/${id}` : "/products";
  }

  // --- branches ---
  branchesCrud(id?: number): string {
    return id != null ? `/branches/${id}` : "/branches";
  }

  // --- users ---
  usersCrud(id?: number): string {
    return id != null ? `/users/${id}` : "/users";
  }

  // --- profile ---
  profileCrud(): string {
    return "/profile";
  }

  profileChangePassword(): string {
    return "/profile/change-password";
  }

  // --- cash registers ---
  cashRegistersCrud(): string {
    return "/cash-registers";
  }

  cashRegisterOpen(): string {
    return "/cash-registers/open";
  }

  cashRegisterClose(id: number): string {
    return `/cash-registers/${id}/close`;
  }

  cashRegisterCurrent(branchId: number): string {
    return `/cash-registers/branches/${branchId}/current`;
  }

  // --- sales & payments ---
  salesCrud(id?: number): string {
    return id != null ? `/sales/${id}` : "/sales";
  }

  saleCancel(id: number): string {
    return `/sales/${id}/cancel`;
  }

  paymentsCrud(): string {
    return "/payments";
  }

  cashierMySales(): string {
    return "/cashier/my-sales";
  }

  // --- transfers ---
  transfersCrud(id?: number): string {
    return id != null ? `/transfers/${id}` : "/transfers";
  }

  transferApprove(id: number): string {
    return `/transfers/${id}/approve`;
  }

  transferReject(id: number): string {
    return `/transfers/${id}/reject`;
  }

  transferComplete(id: number): string {
    return `/transfers/${id}/complete`;
  }

  transferCancel(id: number): string {
    return `/transfers/${id}/cancel`;
  }

  // --- inventory ---
  inventoryByBranch(branchId: number): string {
    return `/inventory/branches/${branchId}/inventory`;
  }

  inventoryLowStock(): string {
    return "/inventory/low-stock";
  }

  inventoryLowStockByBranch(branchId: number): string {
    return `/inventory/branches/${branchId}/low-stock`;
  }

  inventoryProduct(branchId: number, productId: number): string {
    return `/inventory/branches/${branchId}/products/${productId}`;
  }

  inventoryProductAdjust(branchId: number, productId: number): string {
    return `${this.inventoryProduct(branchId, productId)}/adjust`;
  }

  // --- notifications ---
  notificationsAll(): string {
    return "/notifications/all";
  }

  notificationsCrud(id: number): string {
    return `/notifications/${id}`;
  }

  notificationRead(id: number): string {
    return `/notifications/${id}/read`;
  }

  notificationsMarkAllRead(): string {
    return "/notifications/mark-all-read";
  }

  // --- reports ---
  reportsSalesSummary(): string {
    return "/reports/sales/summary";
  }

  reportsSalesByBranch(): string {
    return "/reports/sales/by-branch";
  }

  reportsSalesByCashier(): string {
    return "/reports/sales/by-cashier";
  }

  reportsInventoryStatus(): string {
    return "/reports/inventory/status";
  }

  // --- audit ---
  auditCrud(): string {
    return "/audit-logs";
  }
}
