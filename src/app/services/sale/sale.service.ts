import { Injectable, inject } from "@angular/core";
import { SaleDao } from "../../DAO/sale/sale.dao";
import { SaleRequest, SaleResponse } from "../../DTO/sale.dto";
import { SaleModel } from "../../model/Domain/sale.model";
import { CrudComponent } from "../../model/Domain/crud-component";
import { MessageProcessingService } from "../../../util/messageProcessingCenter/message-processing.service";

@Injectable({ providedIn: "root" })
export class SaleService {
  private readonly dao = inject(SaleDao);
  private readonly messages = inject(MessageProcessingService);
  readonly model = inject(SaleModel);

  retrieveList(): void {
    this.model.loading.set(true);

    this.dao.get().subscribe({
      next: (list) => this.afterRetrieveList((list as SaleResponse[]) ?? []),
      error: (err) => {
        this.model.list.set([]);
        this.model.loading.set(false);
        this.messages.publishErrorMsg("errorGettingSales", err);
      },
    });
  }

  private afterRetrieveList(list: SaleResponse[]): void {
    this.model.list.set(list);
    this.model.loading.set(false);
  }

  retrieveMySales(): void {
    this.model.loading.set(true);

    this.dao.getMySales().subscribe({
      next: (list) => {
        this.model.mySales.set(list ?? []);
        this.model.loading.set(false);
      },
      error: (err) => {
        this.model.mySales.set([]);
        this.model.loading.set(false);
        this.messages.publishErrorMsg("errorGettingMySales", err);
      },
    });
  }


  retrieveSaleDetail(id: number): void {
    this.model.detail.set(null);

    this.dao.get(id).subscribe({
      next: (sale) => this.model.detail.set(sale as SaleResponse),
      error: (err) => this.messages.publishErrorMsg("errorGettingSaleDetail", err),
    });
  }

  retrieveDetail(id: number): void {
    this.model.detail.set(null);

    this.dao.getMySaleDetail(id).subscribe({
      next: (sale) => this.model.detail.set(sale),
      error: (err) => this.messages.publishErrorMsg("errorGettingMySaleDetail", err),
    });
  }

  save(request: SaleRequest, component?: CrudComponent): void {
    this.model.loading.set(true);
    this.model.error.set(null);

    this.dao.create(request).subscribe({
      next: (sale) => {
        this.model.loading.set(false);
        this.model.list.update((list) => [sale, ...list]);
        this.messages.publishSuccessMsg("saleCreated");
        component?.afterSave?.();
      },
      error: (err) => {
        this.model.loading.set(false);
        this.model.error.set(this.messages.resolveErrorDetail("errorCreatingSale", err));
        this.messages.publishErrorMsg("errorCreatingSale", err);
      },
    });
  }

  cancel(id: number, reason: string, component?: CrudComponent): void {
    this.dao.cancel(id, { reason }).subscribe({
      next: (cancelled) => {
        this.model.list.update((list) => list.map((s) => (s.id === id ? cancelled : s)));
        this.messages.publishSuccessMsg("saleCancelled");
        component?.afterSave?.();
      },
      error: (err) => this.messages.publishErrorMsg("errorCancellingSale", err),
    });
  }
}
