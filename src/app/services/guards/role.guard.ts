import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";

export function roleGuard(roles: string[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.model.isAuthenticated()) {
      return router.createUrlTree(["/auth/login"]);
    }

    const role = auth.model.currentUser()?.role;
    if (role && roles.includes(role)) {
      return true;
    }

    return router.createUrlTree(["/403"]);
  };
}
