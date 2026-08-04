import { HttpInterceptorFn } from '@angular/common/http';
import { TOKEN_KEY } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && !req.url.includes('/api/auth/login')) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(req);
};
