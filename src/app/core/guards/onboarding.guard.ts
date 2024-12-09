import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { OrganizationService } from '../services/organization.service';
import { map } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';

export const onboardingGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const orgService = inject(OrganizationService);

  return toObservable(orgService.hasCompletedOnboarding$).pipe(
    map((completed) => {
      if (!completed) {
        return router.createUrlTree(['app/organizations/onboarding']);
      }
      return true;
    })
  );
};
