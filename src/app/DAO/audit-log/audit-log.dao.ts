import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuditLogResponse } from "../../DTO/audit-log.dto";
import { PageResponse } from "../../DTO/pagination.dto";
import { RestPathService } from "../../../util/restPath/rest-path.service";

@Injectable({ providedIn: "root" })
export class AuditLogDao {
  private readonly http = inject(HttpClient);
  private readonly url = inject(RestPathService);

  getAll(page = 0, size = 50): Observable<PageResponse<AuditLogResponse>> {
    const params = new HttpParams().set("page", page).set("size", size);
    return this.http.get<PageResponse<AuditLogResponse>>(this.url.auditCrud(), { params });
  }
}
