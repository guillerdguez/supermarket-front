import { Injectable, inject } from "@angular/core";
import { InventoryDao } from "../../DAO/inventory/inventory.dao";
import {
  BranchInventoryResponse,
  StockAdjustmentRequest,
} from "../../DTO/inventory.dto";
import { InventoryModel } from "../../model/Domain/inventory.model";
import { MessageProcessingService } from "../../../util/messageProcessingCenter/message-processing.service";

@Injectable({ providedIn: "root" })
export class InventoryService {
  private readonly dao = inject(InventoryDao);
  private readonly messages = inject(MessageProcessingService);
  readonly model = inject(InventoryModel);

  retrieveByBranch(branchId: number): void {
    this.model.loading.set(true);
    this.model.error.set(null);

    this.dao.getByBranch(branchId).subscribe({
      next: (list) => this.afterRetrieveList(list ?? []),
      error: (err) => {
        this.model.error.set(this.messages.resolveErrorDetail("errorGettingInventory", err));
        this.model.list.set([]);
        this.model.loading.set(false);
        this.messages.publishErrorMsg("errorGettingInventory", err);
      },
    });
  }

  private afterRetrieveList(list: BranchInventoryResponse[]): void {
    this.model.list.set(list);
    this.model.loading.set(false);
  }

  retrieveLowStock(): void {
    this.dao.getLowStock().subscribe({
      next: (list) => this.model.alerts.set(list ?? []),
      error: () => this.model.alerts.set([]),
    });
  }

  retrieveStatus(): void {
    this.dao.getStatus().subscribe({
      next: (status) => this.model.status.set(status),
      error: () => this.model.status.set(null),
    });
  }

  adjustStock(branchId: number, productId: number, body: StockAdjustmentRequest): void {
    this.dao.adjustStock(branchId, productId, body).subscribe({
      next: (updated) => this.afterStockChange(updated),
      error: (err) => this.messages.publishErrorMsg("errorAdjustingStock", err),
    });
  }

  updateStock(branchId: number, productId: number, stock: number, minStock: number): void {
    this.dao.updateStock(branchId, productId, { stock, minStock }).subscribe({
      next: (updated) => {
        this.afterStockChange(updated);
        this.retrieveLowStock();
        this.retrieveStatus();
      },
      error: (err) => this.messages.publishErrorMsg("errorUpdatingStock", err),
    });
  }

  /** Refresca la fila y avisa; si queda bajo mínimos el aviso sube a warning. */
  private afterStockChange(updated: BranchInventoryResponse): void {
    this.model.list.update((list) => list.map((i) => (i.id === updated.id ? updated : i)));

    const detail = `${updated.productName}: ${updated.stock} uds. (mín. ${updated.minStock})`;
    if (updated.stock <= updated.minStock) {
      this.messages.publishWarnMsg("lowStockWarning", detail);
    } else {
      this.messages.publishSuccessMsg("stockUpdated", detail);
    }
  }
}
