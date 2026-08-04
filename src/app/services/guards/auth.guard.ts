import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";

export const authGuard: CanActivateFn = () => {
  // Se inyecta el service (no el Model) para forzar su constructor, que es
  // quien rehidrata la sesión desde localStorage.
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.model.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(["/auth/login"]);
};
