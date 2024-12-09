import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return of(authService.isAuthenticated()).pipe(
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        return router.createUrlTree(['/auth/login']);
      }
      return true;
    })
  );
};
