import { Injectable, inject } from "@angular/core";
import { AuditLogDao } from "../../DAO/audit-log/audit-log.dao";
import { AuditLogResponse } from "../../DTO/audit-log.dto";
import { AuditLogModel } from "../../model/Domain/audit-log.model";
import { MessageProcessingService } from "../../../util/messageProcessingCenter/message-processing.service";

@Injectable({ providedIn: "root" })
export class AuditLogService {
  private readonly dao = inject(AuditLogDao);
  private readonly messages = inject(MessageProcessingService);
  readonly model = inject(AuditLogModel);

  retrieveList(page = 0): void {
    this.model.loading.set(true);

    this.dao.getAll(page).subscribe({
      next: (result) => this.afterRetrieveList(result?.content ?? []),
      error: (err) => {
        this.model.list.set([]);
        this.model.loading.set(false);
        this.messages.publishErrorMsg("errorGettingAuditLog", err);
      },
    });
  }

  private afterRetrieveList(list: AuditLogResponse[]): void {
    this.model.list.set(list);
    this.model.loading.set(false);
  }
}
