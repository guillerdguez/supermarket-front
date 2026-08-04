export interface SaleDetailRequest { productId: number; quantity: number; }
export interface SaleRequest { branchId: number; details: SaleDetailRequest[]; date?: string; }
export interface PaymentRequest {
  saleId: number; amount: number;
  paymentType: "CASH" | "CARD" | "TRANSFER" | "OTHER"; reference?: string;
}
export interface SaleDetailResponse {
  id: number; productName: string; quantity: number; unitPrice: number; subtotal: number;
}
export interface SaleResponse {
  id: number; total: number; status: "REGISTERED" | "CANCELLED" | string;
  branchId: number; branchName?: string; createdAt?: string;
  details?: SaleDetailResponse[]; cashRegisterId?: number; createdByUsername?: string;
}
export interface CancelSaleRequest { reason: string; }
