import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  SaleRequest,
  SaleResponse,
  PaymentRequest,
  CancelSaleRequest,
} from "../../DTO/sale.dto";
import { RestPathService } from "../../../util/restPath/rest-path.service";

@Injectable({ providedIn: "root" })
export class SaleDao {
  private readonly http = inject(HttpClient);
  private readonly url = inject(RestPathService);

  get(id?: number): Observable<SaleResponse[] | SaleResponse> {
    if (id) {
      return this.http.get<SaleResponse>(this.url.salesCrud(id));
    } else {
      return this.http.get<SaleResponse[]>(this.url.salesCrud());
    }
  }

  create(body: SaleRequest): Observable<SaleResponse> {
    return this.http.post<SaleResponse>(this.url.salesCrud(), body);
  }

  cancel(id: number, body: CancelSaleRequest): Observable<SaleResponse> {
    return this.http.post<SaleResponse>(this.url.saleCancel(id), body);
  }

  registerPayment(body: PaymentRequest): Observable<unknown> {
    return this.http.post(this.url.paymentsCrud(), body);
  }

  getMySales(): Observable<SaleResponse[]> {
    return this.http.get<SaleResponse[]>(this.url.cashierMySales());
  }

  getMySaleDetail(id: number): Observable<SaleResponse> {
    return this.http.get<SaleResponse>(this.url.cashierMySaleDetail(id));
  }
}
