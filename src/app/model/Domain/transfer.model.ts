import { Injectable, signal } from "@angular/core";
import { TransferResponse } from "../../DTO/transfer.dto";

export type TransferSeverity = "success" | "info" | "warn" | "danger" | "secondary";

const TRANSFER_STATUS_SEVERITY: Record<string, TransferSeverity> = {
  COMPLETED: "success",
  APPROVED: "info",
  PENDING: "warn",
  REJECTED: "danger",
  CANCELLED: "danger",
};

export function transferStatusSeverity(status: string): TransferSeverity {
  return TRANSFER_STATUS_SEVERITY[status] || "secondary";
}

@Injectable({ providedIn: "root" })
export class TransferModel {
  readonly list = signal<TransferResponse[]>([]);
  readonly mine = signal<TransferResponse[]>([]);
  readonly detail = signal<TransferResponse | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
