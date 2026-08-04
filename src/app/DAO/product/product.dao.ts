import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ProductResponse, ProductRequest } from "../../DTO/product.dto";
import { PageResponse } from "../../DTO/pagination.dto";
import { RestPathService } from "../../../util/restPath/rest-path.service";

@Injectable({ providedIn: "root" })
export class ProductDao {
  private readonly http = inject(HttpClient);
  private readonly url = inject(RestPathService);

  getAll(search?: string): Observable<PageResponse<ProductResponse>> {
    let params = new HttpParams().set("page", "0").set("size", "50");
    if (search?.trim()) {
      params = params.set("name", search.trim());
    }
    return this.http.get<PageResponse<ProductResponse>>(this.url.productsCrud(), { params });
  }

  getById(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(this.url.productsCrud(id));
  }

  create(body: ProductRequest): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.url.productsCrud(), body);
  }

  update(id: number, body: ProductRequest): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(this.url.productsCrud(id), body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.url.productsCrud(id));
  }
}
