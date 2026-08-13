import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { UserResponse, UserRequest, RoleUpdateRequest } from "../../DTO/user.dto";
import { RestPathService } from "../../../util/restPath/rest-path.service";

@Injectable({ providedIn: "root" })
export class UserDao {
  private readonly http = inject(HttpClient);
  private readonly url = inject(RestPathService);

  get(id?: number, username?: string): Observable<UserResponse[] | UserResponse> {
    if (id) {
      return this.http.get<UserResponse>(this.url.usersCrud(id));
    } else {
      let params = new HttpParams();
      if (username) params = params.set("username", username);
      return this.http.get<UserResponse[]>(this.url.usersCrud(), { params });
    }
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
