import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  CashRegisterResponse,
  OpenRegisterRequest,
  CloseRegisterRequest,
} from "../../DTO/cash-register.dto";
import { RestPathService } from "../../../util/restPath/rest-path.service";

@Injectable({ providedIn: "root" })
export class CashRegisterDao {
  private readonly http = inject(HttpClient);
  private readonly url = inject(RestPathService);

  getCurrent(branchId: number): Observable<CashRegisterResponse> {
    return this.http.get<CashRegisterResponse>(this.url.cashRegisterCurrent(branchId));
  }

  open(body: OpenRegisterRequest): Observable<CashRegisterResponse> {
    return this.http.post<CashRegisterResponse>(this.url.cashRegisterOpen(), body);
  }

  close(id: number, body: CloseRegisterRequest): Observable<CashRegisterResponse> {
    return this.http.post<CashRegisterResponse>(this.url.cashRegisterClose(id), body);
  }

  getAll(): Observable<CashRegisterResponse[]> {
    return this.http.get<CashRegisterResponse[]>(this.url.cashRegistersCrud());
  }
}
