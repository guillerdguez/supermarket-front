export interface ReportFilterRequest { startDate?: string; endDate?: string; branchId?: number; }
export interface SalesSummaryResponse { totalRevenue: number; transactionCount: number; averageTicket: number; }
export interface SalesByBranchDTO { branchId: number; branchName: string; totalRevenue: number; transactionCount: number; }
export interface SalesByCashierDTO {
  cashierId: number; cashierUsername: string; totalRevenue: number;
  transactionCount: number; averageTicket: number;
}
export interface InventoryStatusResponse {
  totalProducts: number; totalUnitsInStock: number; totalInventoryValue: number;
  lowStockCount: number; outOfStockCount: number;
}
