import { inject } from "@angular/core";
import { Router, UrlTree } from "@angular/router";
import { AuthService } from "../auth/auth.service";

export const authGuard = (): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isTokenValid()) {
    return true;
  }

  return router.createUrlTree(["/auth/login"]);
};
