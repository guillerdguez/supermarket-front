import { Injectable, inject } from "@angular/core";
import { CashRegisterDao } from "../../DAO/cash-register/cash-register.dao";
import {
  CashRegisterResponse,
  OpenRegisterRequest,
  CloseRegisterRequest,
} from "../../DTO/cash-register.dto";
import { CashRegisterModel } from "../../model/Domain/cash-register.model";
import { CrudComponent } from "../../model/Domain/crud-component";
import { MessageProcessingService } from "../../../util/messageProcessingCenter/message-processing.service";

@Injectable({ providedIn: "root" })
export class CashRegisterService {
  private readonly dao = inject(CashRegisterDao);
  private readonly messages = inject(MessageProcessingService);
  readonly model = inject(CashRegisterModel);

  retrieveCurrent(branchId: number): void {
    this.model.loading.set(true);
    this.model.error.set(null);

    this.dao.getCurrent(branchId).subscribe({
      next: (register) => {
        this.model.current.set(register);
        this.model.loading.set(false);
      },
      error: (err) => {
        this.model.current.set(null);
        this.model.loading.set(false);
        if (err?.status !== 404) {
          this.model.error.set(this.messages.resolveErrorDetail("errorGettingRegister", err));
        }
      },
    });
  }

  retrieveList(): void {
    this.model.loading.set(true);

    this.dao.getAll().subscribe({
      next: (list) => this.afterRetrieveList(list ?? []),
      error: (err) => {
        this.model.list.set([]);
        this.model.loading.set(false);
        this.model.error.set(this.messages.resolveErrorDetail("errorGettingRegisters", err));
      },
    });
  }

  private afterRetrieveList(list: CashRegisterResponse[]): void {
    this.model.list.set(list);
    this.model.loading.set(false);
  }

  open(body: OpenRegisterRequest, component?: CrudComponent): void {
    this.model.loading.set(true);

    this.dao.open(body).subscribe({
      next: (register) => {
        this.model.current.set(register);
        this.model.loading.set(false);
        this.messages.publishSuccessMsg("registerOpened");
        component?.afterSave?.();
      },
      error: (err) => {
        this.model.loading.set(false);
        this.model.error.set(this.messages.resolveErrorDetail("errorOpeningRegister", err));
        this.messages.publishErrorMsg("errorOpeningRegister", err);
      },
    });
  }

  close(id: number, body: CloseRegisterRequest, component?: CrudComponent): void {
    this.model.loading.set(true);

    this.dao.close(id, body).subscribe({
      next: (register) => {
        this.model.current.set(register);
        this.model.loading.set(false);
        this.messages.publishSuccessMsg("registerClosed");
        component?.afterSave?.();
      },
      error: (err) => {
        this.model.loading.set(false);
        this.messages.publishErrorMsg("errorClosingRegister", err);
      },
    });
  }
}
