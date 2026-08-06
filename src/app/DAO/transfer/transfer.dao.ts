import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  TransferRequest,
  TransferResponse,
  RejectTransferRequest,
} from "../../DTO/transfer.dto";
import { RestPathService } from "../../../util/restPath/rest-path.service";

@Injectable({ providedIn: "root" })
export class TransferDao {
  private readonly http = inject(HttpClient);
  private readonly url = inject(RestPathService);

  getAll(): Observable<TransferResponse[]> {
    return this.http.get<TransferResponse[]>(this.url.transfersCrud());
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
