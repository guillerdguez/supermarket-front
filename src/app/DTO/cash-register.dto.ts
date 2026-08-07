export type CashRegisterStatus = "OPEN" | "CLOSED";
export interface CashRegisterResponse {
  id: number;
  branchId: number;
  branchName?: string;
  openingBalance: number;
  closingBalance?: number | null;
  openingTime?: string;
  closingTime?: string | null;
  status: CashRegisterStatus;
  openedByUsername?: string;
  closedByUsername?: string;
}
export interface OpenRegisterRequest { branchId?: number | null; openingBalance: number; }
export interface CloseRegisterRequest { closingBalance: number; }
