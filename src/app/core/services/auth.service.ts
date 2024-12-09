import { Injectable, computed, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, delay, tap } from 'rxjs';
import { OrganizationService } from '../services/organization.service';
import { RedirectService } from './redirect.service';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

const MOCK_SUPERUSER: User = {
  id: '1',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin',
  avatar:
    'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private orgService = inject(OrganizationService);
  private redirectService = inject(RedirectService);

  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());

  async login(email: string, password: string) {
    // API call here
    const user = MOCK_SUPERUSER; // Temporary mock
    this.currentUser.set(user);

    const redirectProduct = this.redirectService.getRedirectProduct();
    
    if (redirectProduct === 'meetflow') {
      this.router.navigate(['/meetings']);
    } else if (redirectProduct === 'agileflow') {
      if (this.orgService.hasCompletedOnboarding$()) {
        this.router.navigate(['/app/dashboard']);
      } else {
        this.router.navigate(['/app/organizations/onboarding']);
      }
    } else {
      // Default behavior
      if (this.orgService.hasCompletedOnboarding$()) {
        this.router.navigate(['/app/dashboard']);
      } else {
        this.router.navigate(['/app/organizations/onboarding']);
      }
    }
  }

  async signup(data: any) {
    // API call here
    // const user = await this.apiSignup(data);
    // this.currentUser.set(user);
    this.router.navigate(['/app/organizations/onboarding']);
  }

  logout(): void {
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    // API call here to send reset email
    await Promise.resolve(); // Mock API call
  }
}
