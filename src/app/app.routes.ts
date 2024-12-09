import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layouts/main-layout.component';
import { AuthLayoutComponent } from '@shared/layouts/auth-layout/auth-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { onboardingGuard } from './core/guards/onboarding.guard';
import { LandingComponent } from './features/landing/landing.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./features/auth/signup/signup.component').then(
            (m) => m.SignupComponent
          ),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import(
            './features/auth/forgot-password/forgot-password.component'
          ).then((m) => m.ForgotPasswordComponent),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        canActivate: [onboardingGuard],
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'app/organizations',
    loadChildren: () =>
      import('./features/organizations/organizations.routes').then(
        (m) => m.ORGANIZATION_ROUTES
      ),
  },
  {
    path: 'meetings',
    // canActivate: [onboardingGuard],
    loadChildren: () =>
      import('./features/meetings/meetings.routes').then(
        (m) => m.MEETING_ROUTES
      ),
  },
];
