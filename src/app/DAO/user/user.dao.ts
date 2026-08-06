import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { UserResponse, UserRequest, RoleUpdateRequest } from "../../DTO/user.dto";
import { PageResponse } from "../../DTO/pagination.dto";
import { RestPathService } from "../../../util/restPath/rest-path.service";

@Injectable({ providedIn: "root" })
export class UserDao {
  private readonly http = inject(HttpClient);
  private readonly url = inject(RestPathService);

  getAll(page = 0, size = 100, username?: string): Observable<PageResponse<UserResponse>> {
    let params = new HttpParams().set("page", page).set("size", size);
    if (username) params = params.set("username", username);
    return this.http.get<PageResponse<UserResponse>>(this.url.usersCrud(), { params });
  }

  getById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(this.url.usersCrud(id));
  }

  create(body: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.url.usersCrud(), body);
  }

  update(id: number, body: UserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(this.url.usersCrud(id), body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.url.usersCrud(id));
  }

  activate(id: number): Observable<UserResponse> {
    return this.http.put<UserResponse>(this.url.userActivate(id), {});
  }

  changeRole(id: number, body: RoleUpdateRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(this.url.userChangeRole(id), body);
  }
}
