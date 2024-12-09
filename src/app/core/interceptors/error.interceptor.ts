import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if ([401, 403].includes(error.status)) {
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: router.routerState.snapshot.url },
        });
      }

      const errorMessage = error.error?.message || error.statusText;
      return throwError(() => new Error(errorMessage));
    })
  );
};
