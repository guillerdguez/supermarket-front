import { inject } from "@angular/core";
import { HttpInterceptorFn } from "@angular/common/http";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { TOKEN_KEY, USER_KEY } from "../auth/auth.service";
import { MessageProcessingService } from "../../../util/messageProcessingCenter/message-processing.service";


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
