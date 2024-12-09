import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@shared/components/forms/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LinkComponent } from '@shared/components/link/link.component';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    LinkComponent,
  ],
  template: `
    <div class="space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-3">
          Sign in to your account
        </h2>
        <p class="text-base text-gray-600">
          Don't have an account?
          <app-link to="/auth/signup" variant="primary" class="ml-1">
            Sign up
          </app-link>
        </p>
      </div>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div class="space-y-5">
          <app-input
            label="Email address"
            type="email"
            formControlName="email"
            [error]="getError('email')"
          />

          <app-input
            label="Password"
            type="password"
            formControlName="password"
            [error]="getError('password')"
          />
        </div>

        <div class="flex items-center justify-end">
          <app-link to="/auth/forgot-password" variant="subtle" size="sm">
            Forgot password?
          </app-link>
        </div>

        <div class="pt-2">
          <app-button
            type="submit"
            variant="primary"
            [fullWidth]="true"
            [loading]="isLoading"
            [disabled]="!loginForm.valid || isLoading"
          >
            Sign in
          </app-button>
        </div>
      </form>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  isLoading = false;

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  getError(field: string): string {
    const control = this.loginForm.get(field);
    if (control?.touched && control.errors) {
      if (control.errors['required']) return `${field} is required`;
      if (control.errors['email']) return 'Invalid email address';
    }
    return '';
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      try {
        const { email, password } = this.loginForm.getRawValue();
        await this.authService.login(email, password);
      } catch (error) {
        // Handle error
      } finally {
        this.isLoading = false;
      }
    }
  }
}
