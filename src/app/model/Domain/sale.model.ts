import { Injectable, signal } from "@angular/core";
import { SaleResponse } from "../../DTO/sale.dto";

export const PAYMENT_TYPE_LABELS: Record<string, string> = {
  CASH: "Efectivo",
  CARD: "Tarjeta",
  TRANSFER: "Transferencia",
  OTHER: "Otro",
};

@Injectable({ providedIn: "root" })
export class SaleModel {
  readonly list = signal<SaleResponse[]>([]);
  readonly mySales = signal<SaleResponse[]>([]);
  readonly detail = signal<SaleResponse | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
