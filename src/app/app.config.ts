import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading,
  withRouterConfig,
  withViewTransitions,
  TitleStrategy,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideDialogConfig } from '@ngneat/dialog';

import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { AppTitleStrategy } from './core/services/app-title.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      withPreloading(PreloadAllModules),
      withViewTransitions()
    ),
    provideHttpClient(withInterceptors([errorInterceptor])),
    {
      provide: TitleStrategy,
      useClass: AppTitleStrategy,
    },
    provideDialogConfig({
      closeButton: true,
      backdrop: true,
      enableClose: {
        escape: true,
        backdrop: false,
      },
      resizable: false,
      draggable: false,
      sizes: {
        sm: { width: '400px' },
        md: { width: '560px' },
        lg: { width: '800px' },
        xl: { width: '90%' },
        full: { width: '100dvw', height: '100dvh' },
      },
    }),
  ],
};
