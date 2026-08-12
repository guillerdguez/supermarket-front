import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { TransferDao } from "../../DAO/transfer/transfer.dao";
import { TransferRequest, TransferResponse } from "../../DTO/transfer.dto";
import { TransferModel } from "../../model/Domain/transfer.model";
import { CrudComponent } from "../../model/Domain/crud-component";
import { MessageProcessingService } from "../../../util/messageProcessingCenter/message-processing.service";
import { MessageKey } from "../../../util/messageProcessingCenter/message-keys";

@Injectable({ providedIn: "root" })
export class TransferService {
  private readonly dao = inject(TransferDao);
  private readonly messages = inject(MessageProcessingService);
  readonly model = inject(TransferModel);

  retrieveList(): void {
    this.model.loading.set(true);

    this.dao.getAll().subscribe({
      next: (res) => this.afterRetrieveList(res?.content ?? []),
      error: (err) => {
        this.model.list.set([]);
        this.model.loading.set(false);
        this.model.error.set(this.messages.resolveErrorDetail("errorGettingTransfers", err));
      },
    });
  }

  private afterRetrieveList(list: TransferResponse[]): void {
    this.model.list.set(list);
    this.model.loading.set(false);
  }

  retrieveDetail(id: number): void {
    this.model.detail.set(null);

    this.dao.getDetail(id).subscribe({
      next: (transfer) => this.model.detail.set(transfer),
      error: (err) => this.messages.publishErrorMsg("errorGettingTransferDetail", err),
    });
  }

  retrieveMine(): void {
    this.model.loading.set(true);

    this.dao.getMine().subscribe({
      next: (list) => {
        this.model.mine.set(list ?? []);
        this.model.loading.set(false);
      },
      error: (err) => {
        this.model.mine.set([]);
        this.model.loading.set(false);
        this.messages.publishErrorMsg("errorGettingMyTransfers", err);
      },
    });
  }

  save(body: TransferRequest, component?: CrudComponent): void {
    this.model.loading.set(true);

    this.dao.request(body).subscribe({
      next: (created) => {
        this.model.loading.set(false);
        this.model.list.update((list) => [created, ...list]);
        this.model.mine.update((list) => [created, ...list]);
        this.messages.publishSuccessMsg("transferRequested");
        component?.afterSave?.();
      },
      error: (err) => {
        this.model.loading.set(false);
        this.model.error.set(this.messages.resolveErrorDetail("errorRequestingTransfer", err));
        this.messages.publishErrorMsg("errorRequestingTransfer", err);
      },
    });
  }

  approve(id: number, component?: CrudComponent): void {
    this.changeStatus(this.dao.approve(id), "transferApproved", component);
  }

  reject(id: number, reason: string, component?: CrudComponent): void {
    this.changeStatus(this.dao.reject(id, { reason }), "transferRejected", component);
  }

  complete(id: number, component?: CrudComponent): void {
    this.changeStatus(this.dao.complete(id), "transferCompleted", component);
  }

  cancel(id: number, component?: CrudComponent): void {
    this.changeStatus(this.dao.cancel(id), "transferCancelled", component);
  }

  
  private changeStatus(
    request$: Observable<TransferResponse>,
    successKey: MessageKey,
    component?: CrudComponent,
  ): void {
    request$.subscribe({
      next: (updated) => {
        this.model.list.update((list) =>
          list.map((t) => (t.id === updated.id ? updated : t)),
        );
        this.model.mine.update((list) =>
          list.map((t) => (t.id === updated.id ? updated : t)),
        );
        this.messages.publishSuccessMsg(successKey);
        component?.afterSave?.();
      },
      error: (err) => this.messages.publishErrorMsg("errorUpdatingTransfer", err),
    });
  }
}
