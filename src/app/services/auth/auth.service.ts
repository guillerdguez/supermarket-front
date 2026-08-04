import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthDao } from "../../DAO/auth/auth.dao";
import { LoginRequest, UserResponse } from "../../DTO/auth.dto";
import { AuthModel } from "../../model/Domain/auth.model";
import { MessageProcessingService } from "../../../util/messageProcessingCenter/message-processing.service";

export const TOKEN_KEY = "access_token";
export const USER_KEY = "current_user";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly dao = inject(AuthDao);
  private readonly router = inject(Router);
  private readonly messages = inject(MessageProcessingService);
  readonly model = inject(AuthModel);

  constructor() {
    this.hydrateFromStorage();
  }

  /**
   * Refresca el usuario en memoria y en storage con datos recién traídos del
   * back. Necesario porque quien ya tenía sesión abierta guardó un
   * current_user sin branchId.
   */
  setCurrentUser(user: UserResponse): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.model.currentUser.set(user);
  }

  private hydrateFromStorage(): void {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);
    if (!token || !raw) return;

    try {
      this.model.currentUser.set(JSON.parse(raw) as UserResponse);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }

  login(credentials: LoginRequest): void {
    this.model.loading.set(true);

    this.dao.login(credentials).subscribe({
      next: (res) => {
        localStorage.setItem(TOKEN_KEY, res.token);
        this.setCurrentUser(res.user);
        this.model.loading.set(false);

        this.router.navigateByUrl(
          res.user.role === "CASHIER" ? "/cashier/dashboard" : "/admin/dashboard",
        );
      },
      error: (err) => {
        this.model.loading.set(false);
        this.messages.publishErrorMsg("errorLogin", err);
      },
    });
  }

  logout(): void {
    this.dao.logout().subscribe({ error: () => undefined });
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.model.currentUser.set(null);
    this.router.navigateByUrl("/auth/login");
  }
}
