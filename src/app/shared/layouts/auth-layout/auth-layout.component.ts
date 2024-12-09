import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="min-h-screen bg-slate-50 flex">
      <!-- Left side with pattern -->
      <div
        class="hidden lg:flex lg:w-1/2 bg-primary-600 relative overflow-hidden"
      >
        <div class="absolute inset-0 auth-pattern"></div>
        <div
          class="relative z-10 flex flex-col justify-center px-24 text-white"
        >
          <img
            src="assets/images/logo-light.svg"
            alt="AgileFlow Logo"
            class="h-12 mb-8"
          />
          <h1 class="text-4xl font-bold mb-4">Welcome to AgileFlow</h1>
          <p class="text-lg text-white/80">
            Your complete agile project management solution
          </p>
        </div>
      </div>

      <!-- Right side with content -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div class="w-full max-w-md">
          <!-- Mobile logo -->
          <div class="lg:hidden mb-8 text-center">
            <img
              src="assets/images/logo.svg"
              alt="AgileFlow Logo"
              class="h-10 mx-auto"
            />
          </div>

          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-pattern {
        background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      }
    `,
  ],
})
export class AuthLayoutComponent {}
