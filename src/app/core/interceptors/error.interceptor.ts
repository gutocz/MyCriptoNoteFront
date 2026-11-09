import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastrService);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // An authentication challenge comes from the bearer middleware. A wrong
      // note/folder password is also a 401, but must not end the user's session.
      if (err.status === 401 && err.headers.has('WWW-Authenticate') && !req.url.endsWith('/auth/logout')) {
        auth.clearSession();
        router.navigate(['/login']);
        return throwError(() => err);
      }
      const msg = err.error?.message ?? err.error?.error ?? err.message ?? 'Erro inesperado';
      if (err.status >= 500) {
        toast.error(msg, 'Erro');
      } else if ([400, 404, 409].includes(err.status)) {
        toast.error(msg);
      }
      return throwError(() => err);
    })
  );
};
