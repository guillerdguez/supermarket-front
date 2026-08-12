import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  TransferRequest,
  TransferResponse,
  RejectTransferRequest,
} from "../../DTO/transfer.dto";
import { PageResponse } from "../../DTO/pagination.dto";
import { RestPathService } from "../../../util/restPath/rest-path.service";

@Injectable({ providedIn: "root" })
export class TransferDao {
  private readonly http = inject(HttpClient);
  private readonly url = inject(RestPathService);

  getAll(size = 200): Observable<PageResponse<TransferResponse>> {
    const params = new HttpParams().set("page", "0").set("size", size);
    return this.http.get<PageResponse<TransferResponse>>(this.url.transfersCrud(), { params });
  }

  getDetail(id: number): Observable<TransferResponse> {
    return this.http.get<TransferResponse>(this.url.transfersCrud(id));
  }

  getMine(): Observable<TransferResponse[]> {
    return this.http.get<TransferResponse[]>(this.url.transfersMine());
  }

  request(body: TransferRequest): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(this.url.transfersCrud(), body);
  }

  approve(id: number): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(this.url.transferApprove(id), {});
  }

  reject(id: number, body: RejectTransferRequest): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(this.url.transferReject(id), body);
  }

  complete(id: number): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(this.url.transferComplete(id), {});
  }

  cancel(id: number): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(this.url.transferCancel(id), {});
  }
}
