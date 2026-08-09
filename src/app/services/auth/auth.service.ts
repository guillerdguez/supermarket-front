import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthDao } from "../../DAO/auth/auth.dao";
import { LoginRequest, UserResponse } from "../../DTO/auth.dto";
import { AuthModel } from "../../model/Domain/auth.model";
import { MessageProcessingService } from "../../../util/messageProcessingCenter/message-processing.service";
import { jwtDecode, JwtPayload } from "jwt-decode";

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

  setCurrentUser(user: UserResponse): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.model.currentUser.set(user);
  }

  private hydrateFromStorage(): void {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw || !this.isTokenValid()) return;

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

        this.router.navigateByUrl(this.homeUrl());
      },
      error: (err) => {
        this.model.loading.set(false);
        this.messages.publishErrorMsg("errorLogin", err);
      },
    });
  }

  homeUrl(): string {
    return this.model.currentUser()?.role === "CASHIER" ? "/cashier/dashboard" : "/admin/dashboard";
  }

  logout(): void {
    this.dao.logout().subscribe({ error: () => undefined });
    this.clearSession();
    this.router.navigateByUrl("/auth/login");
  }

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.model.currentUser.set(null);
  }

  isTokenValid(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Math.floor(Date.now() / 1000);
      return (decoded.exp ?? 0) > now;
    } catch {
      return false;
    }
  }
}
