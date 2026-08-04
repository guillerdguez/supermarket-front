import { inject } from "@angular/core";
import { HttpInterceptorFn } from "@angular/common/http";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { TOKEN_KEY, USER_KEY } from "../auth/auth.service";
import { MessageProcessingService } from "../../../util/messageProcessingCenter/message-processing.service";

/**
 * Sesión caducada: limpia el token, avisa y manda al login por el router (no
 * window.location.href: una recarga dura se llevaría el toast antes de que se
 * vea). Se excluye la propia petición de login para no pisar el toast de
 * "credenciales incorrectas" que ya publica AuthService. El resto de errores
 * los traduce a mensaje cada service vía MessageProcessingService.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const messages = inject(MessageProcessingService);

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401 && !req.url.includes("/api/auth/login")) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        messages.publishWarnMsg("sessionExpired");
        router.navigateByUrl("/auth/login");
      }
      return throwError(() => err);
    }),
  );
};
