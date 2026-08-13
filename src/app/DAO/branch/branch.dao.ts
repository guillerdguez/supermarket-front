import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { BranchResponse, BranchRequest } from "../../DTO/branch.dto";
import { RestPathService } from "../../../util/restPath/rest-path.service";

@Injectable({ providedIn: "root" })
export class BranchDao {
  private readonly http = inject(HttpClient);
  private readonly url = inject(RestPathService);

  get(id?: number): Observable<BranchResponse[] | BranchResponse> {
    if (id) {
      return this.http.get<BranchResponse>(this.url.branchesCrud(id));
    } else {
      return this.http.get<BranchResponse[]>(this.url.branchesCrud());
    }
  }

  create(body: BranchRequest): Observable<BranchResponse> {
    return this.http.post<BranchResponse>(this.url.branchesCrud(), body);
  }

  update(id: number, body: BranchRequest): Observable<BranchResponse> {
    return this.http.put<BranchResponse>(this.url.branchesCrud(id), body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.url.branchesCrud(id));
  }
}
