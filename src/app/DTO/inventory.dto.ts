export interface BranchInventoryResponse {
  id: number;
  branchId: number;
  branchName: string;
  productId: number;
  productName: string;
  productCategory: string;
  stock: number;
  minStock: number;
  lastRestockDate?: string;
}

export interface LowStockAlertResponse {
  branchId: number;
  branchName: string;
  productId: number;
  productName: string;
  currentStock: number;
  minStock: number;
}

export interface InventoryStatusResponse {
  totalProducts: number;
  totalUnitsInStock: number;
  totalInventoryValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface StockAdjustmentRequest {
  delta: number;
  reason?: string;
}

export interface StockUpdateRequest {
  stock: number;
  minStock: number;
}
