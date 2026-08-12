import { inject } from "@angular/core";
import { Router, UrlTree } from "@angular/router";
import { AuthService } from "../auth/auth.service";

export const guestGuard = (): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isTokenValid()) {
    return router.createUrlTree([auth.homeUrl()]);
  }

  return true;
};
