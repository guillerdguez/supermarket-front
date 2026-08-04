import { Injectable, inject } from "@angular/core";
import { MessageService } from "primeng/api";
import { MESSAGES, MessageKey } from "./message-keys";
import { extractApiError } from "./extract-api-error";

/**
 * Único punto por el que salen los avisos al usuario. Los services publican
 * claves del catálogo (`MESSAGES`), nunca literales.
 */
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

  /**
   * Publica un error. Si se pasa la respuesta HTTP, se prioriza el mensaje que
   * venga del backend y el texto del catálogo queda como fallback.
   */
  publishErrorMsg(key: MessageKey, err?: unknown): void {
    const def = MESSAGES[key];
    this.messages.add({
      severity: "error",
      summary: def.summary,
      detail: this.resolveErrorDetail(key, err),
    });
  }

  /** Mismo texto que publicaría `publishErrorMsg`, para guardarlo en el Model. */
  resolveErrorDetail(key: MessageKey, err?: unknown): string {
    const def = MESSAGES[key];
    return err === undefined ? def.detail : extractApiError(err, def.detail);
  }
}
