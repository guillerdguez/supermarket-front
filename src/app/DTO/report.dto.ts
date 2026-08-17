export interface ReportFilterRequest {
  startDate?: string;
  endDate?: string;
  branchId?: number;
}
export interface SalesSummaryResponse {
  totalRevenue: number;
  transactionCount: number;
  averageTicket: number;
}
export interface SalesByBranchDTO {
  branchId: number;
  branchName: string;
  totalRevenue: number;
  transactionCount: number;
}
export interface SalesByCashierDTO {
  cashierId: number;
  cashierUsername: string;
  totalRevenue: number;
  transactionCount: number;
  averageTicket: number;
}
export interface InventoryStatusResponse {
  totalProducts: number;
  totalUnitsInStock: number;
  totalInventoryValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}
export interface SalesByProductDTO {
  productId: number;
  productName: string;
  productCategory: string;
  totalQuantitySold: number;
  totalRevenue: number;
}
export interface PeriodSummary {
  startDate: string;
  endDate: string;
  totalRevenue: number;
  transactionCount: number;
  averageTicket: number;
}
export interface SalesComparisonResponse {
  currentPeriod: PeriodSummary;
  previousPeriod: PeriodSummary;
  growthPercentage: number;
}
export interface ProductPerformanceDTO {
  productId: number;
  productName: string;
  productCategory: string;
  totalSold: number;
  currentStock: number;
  inventoryTurnoverRate: number;
}
export interface ClosureDiscrepancyDTO {
  registerId: number;
  branchId: number;
  branchName: string;
  openingTime: string;
  closingTime: string;
  openedBy: string;
  closedBy: string;
  expectedAmount: number;
  actualClosingAmount: number;
  varianceAmount: number;
}
export interface CashRegisterReportResponse {
  totalClosures: number;
  totalSurplus: number;
  totalShortage: number;
  discrepancies: ClosureDiscrepancyDTO[];
}
export interface CashRegisterFilterRequest {
  startDate?: string;
  endDate?: string;
  branchId?: number;
  showOnlyDiscrepancies?: boolean;
}
