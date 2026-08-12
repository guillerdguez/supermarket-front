import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  SaleRequest,
  SaleResponse,
  PaymentRequest,
  CancelSaleRequest,
} from "../../DTO/sale.dto";
import { PageResponse } from "../../DTO/pagination.dto";
import { RestPathService } from "../../../util/restPath/rest-path.service";

@Injectable({ providedIn: "root" })
export class SaleDao {
  private readonly http = inject(HttpClient);
  private readonly url = inject(RestPathService);

  getAll(size = 200): Observable<PageResponse<SaleResponse>> {
    const params = new HttpParams().set("page", "0").set("size", size);
    return this.http.get<PageResponse<SaleResponse>>(this.url.salesCrud(), { params });
  }

  getDetail(id: number): Observable<SaleResponse> {
    return this.http.get<SaleResponse>(this.url.salesCrud(id));
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

  getMySales(page = 0, size = 50): Observable<PageResponse<SaleResponse>> {
    const params = new HttpParams().set("page", page).set("size", size);
    return this.http.get<PageResponse<SaleResponse>>(this.url.cashierMySales(), { params });
  }

  getMySaleDetail(id: number): Observable<SaleResponse> {
    return this.http.get<SaleResponse>(this.url.cashierMySaleDetail(id));
  }
}
