import { inject } from "@angular/core";
import { HttpInterceptorFn } from "@angular/common/http";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { MessageProcessingService } from "../../../util/messageProcessingCenter/message-processing.service";


export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const messages = inject(MessageProcessingService);

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401 && !req.url.includes("/api/auth/login")) {
        authService.clearSession();
        messages.publishWarnMsg("sessionExpired");
        router.navigateByUrl("/auth/login");
      }
      if (err.status === 403) {
        messages.publishErrorMsg("accessDenied");
        if (req.method === "GET") {
          router.navigateByUrl("/403");
        }
      }
      return throwError(() => err);
    }),
  );
};
