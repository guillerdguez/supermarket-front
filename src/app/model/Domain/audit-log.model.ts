import { Injectable, signal } from "@angular/core";
import { AuditLogResponse } from "../../DTO/audit-log.dto";

@Injectable({ providedIn: "root" })
export class AuditLogModel {
  readonly list = signal<AuditLogResponse[]>([]);
  readonly loading = signal(false);
}
