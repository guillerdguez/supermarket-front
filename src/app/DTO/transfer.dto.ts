export type TransferStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";
export interface TransferRequest {
  sourceBranchId?: number; targetBranchId?: number; productId: number; quantity: number;
}
export interface TransferResponse {
  id: number; sourceBranchId: number; sourceBranchName?: string;
  targetBranchId: number; targetBranchName?: string;
  productId: number; productName?: string; quantity: number; status: TransferStatus;
  requestedById?: number; requestedByUsername?: string;
  approvedById?: number; approvedByUsername?: string;
  requestedAt?: string; rejectionReason?: string;
}
export interface RejectTransferRequest { reason: string; }
