import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ProductResponse, ProductRequest } from "../../DTO/product.dto";
import { RestPathService } from "../../../util/restPath/rest-path.service";

@Injectable({ providedIn: "root" })
export class ProductDao {
  private readonly http = inject(HttpClient);
  private readonly url = inject(RestPathService);

  get(id?: number, search?: string): Observable<ProductResponse[] | ProductResponse> {
    if (id) {
      return this.http.get<ProductResponse>(this.url.productsCrud(id));
    } else {
      let params = new HttpParams();
      if (search?.trim()) {
        params = params.set("name", search.trim());
      }
      return this.http.get<ProductResponse[]>(this.url.productsCrud(), { params });
    }
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
