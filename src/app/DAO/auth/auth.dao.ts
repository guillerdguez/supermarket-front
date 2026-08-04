import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoginRequest, AuthResponse } from "../../DTO/auth.dto";
import { RestPathService } from "../../../util/restPath/rest-path.service";

@Injectable({ providedIn: "root" })
export class AuthDao {
  private readonly http = inject(HttpClient);
  private readonly url = inject(RestPathService);

  login(body: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.url.authLogin(), body);
  }

  logout(): Observable<unknown> {
    return this.http.post(this.url.authLogout(), {});
  }
}
