import { Injectable, signal } from "@angular/core";
import {
  BranchInventoryResponse,
  LowStockAlertResponse,
  InventoryStatusResponse,
} from "../../DTO/inventory.dto";

@Injectable({ providedIn: "root" })
export class InventoryModel {
  readonly list = signal<BranchInventoryResponse[]>([]);
  readonly alerts = signal<LowStockAlertResponse[]>([]);
  readonly status = signal<InventoryStatusResponse | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
