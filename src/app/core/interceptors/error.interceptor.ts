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
      if (err.status === 401) {
        auth.logout();
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
