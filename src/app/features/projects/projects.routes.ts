import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const PROJECT_ROUTES: Routes = [
  {
    path: 'templates',
    loadComponent: () =>
      import('./create/project-template-selector.component').then(
        (m) => m.ProjectTemplateSelectorComponent
      ),
    title: 'Project Templates',
    canActivate: [authGuard],
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./create/project-create.component').then(
        (m) => m.ProjectCreateComponent
      ),
    title: 'Create Project',
    canActivate: [authGuard],
  },
];
