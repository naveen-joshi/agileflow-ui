import { Routes } from '@angular/router';
import { authGuard } from 'src/app/core/guards/auth.guard';

export const ORGANIZATION_ROUTES: Routes = [
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./onboarding/organization-onboarding.component').then(
        (m) => m.OrganizationOnboardingComponent
      ),
  },
  {
    path: 'setup',
    loadComponent: () =>
      import('./onboarding/organization-setup.component').then(
        (m) => m.OrganizationSetupComponent
      ),
  },
  {
    path: 'team',
    loadComponent: () =>
      import('./members/team-invitation.component').then(
        (m) => m.TeamInvitationComponent
      ),
  },
];
