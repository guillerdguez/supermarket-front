import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { UserResponse } from "../../DTO/auth.dto";
import { ProfileUpdateRequest, ChangePasswordRequest } from "../../DTO/profile.dto";
import { RestPathService } from "../../../util/restPath/rest-path.service";

@Injectable({ providedIn: "root" })
export class ProfileDao {
  private readonly http = inject(HttpClient);
  private readonly url = inject(RestPathService);

  get(): Observable<UserResponse> {
    return this.http.get<UserResponse>(this.url.profileCrud());
  }

  update(body: ProfileUpdateRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(this.url.profileCrud(), body);
  }

  changePassword(body: ChangePasswordRequest): Observable<Record<string, string>> {
    return this.http.post<Record<string, string>>(this.url.profileChangePassword(), body);
  }
}
