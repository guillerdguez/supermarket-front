import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuditLogResponse } from "../../DTO/audit-log.dto";
import { RestPathService } from "../../../util/restPath/rest-path.service";

@Injectable({ providedIn: "root" })
export class AuditLogDao {
  private readonly http = inject(HttpClient);
  private readonly url = inject(RestPathService);

  get(id?: number): Observable<AuditLogResponse[] | AuditLogResponse> {
    if (id) {
      return this.http.get<AuditLogResponse>(this.url.auditCrud(id));
    } else {
      return this.http.get<AuditLogResponse[]>(this.url.auditCrud());
    }
  }
}
