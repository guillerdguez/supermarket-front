import { Injectable, inject } from "@angular/core";
import { MessageService } from "primeng/api";
import { MESSAGES, MessageKey } from "./message-keys";
import { extractApiError } from "./extract-api-error";


@Injectable({ providedIn: "root" })
export class MessageProcessingService {
  private readonly messages = inject(MessageService);

  publishSuccessMsg(key: MessageKey, detailOverride?: string): void {
    const def = MESSAGES[key];
    this.messages.add({
      severity: "success",
      summary: def.summary,
      detail: detailOverride ?? def.detail,
    });
  }

  publishWarnMsg(key: MessageKey, detailOverride?: string): void {
    const def = MESSAGES[key];
    this.messages.add({
      severity: "warn",
      summary: def.summary,
      detail: detailOverride ?? def.detail,
    });
  }


  publishErrorMsg(key: MessageKey, err?: unknown): void {
    const def = MESSAGES[key];
    this.messages.add({
      severity: "error",
      summary: def.summary,
      detail: this.resolveErrorDetail(key, err),
    });
  }

  
  resolveErrorDetail(key: MessageKey, err?: unknown): string {
    const def = MESSAGES[key];
    return err === undefined ? def.detail : extractApiError(err, def.detail);
  }
}
