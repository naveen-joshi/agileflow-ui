import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from '@shared/components/forms/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatIconModule,
    InputComponent,
    ButtonComponent,
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p class="mt-2 text-gray-600">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        @if (!emailSent) {
        <form
          [formGroup]="resetForm"
          (ngSubmit)="onSubmit()"
          class="mt-8 space-y-6"
        >
          <app-input
            formControlName="email"
            type="email"
            label="Email address"
            [error]="getError('email')"
          />

          <div class="flex flex-col gap-4">
            <app-button
              type="submit"
              [loading]="isLoading"
              [disabled]="!resetForm.valid || isLoading"
              class="w-full"
            >
              Send Reset Link
            </app-button>

            <a
              routerLink="/auth/login"
              class="text-center text-sm text-primary-600 hover:text-primary-500"
            >
              Back to Login
            </a>
          </div>
        </form>
        } @else {
        <div class="mt-8 text-center">
          <mat-icon class="text-success-500 text-4xl mb-4"
            >check_circle</mat-icon
          >
          <p class="text-gray-900 font-medium">Check your email</p>
          <p class="mt-2 text-gray-600">
            We've sent a password reset link to
            {{ resetForm.get('email')?.value }}
          </p>
          <a
            routerLink="/auth/login"
            class="mt-6 inline-block text-primary-600 hover:text-primary-500"
          >
            Back to Login
          </a>
        </div>
        }
      </div>
    </div>
  `,
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  public resetForm: FormGroup;

  isLoading = false;
  emailSent = false;

  constructor(private fb: FormBuilder) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async onSubmit() {
    if (this.resetForm.valid) {
      this.isLoading = true;
      try {
        await this.authService.sendPasswordResetEmail(
          this.resetForm.value.email!
        );
        this.emailSent = true;
      } catch (error) {
        // Handle error
      } finally {
        this.isLoading = false;
      }
    }
  }

  getError(field: string): string {
    const control = this.resetForm.get(field);
    if (control?.touched && control.errors) {
      if (control.errors['required']) return `${field} is required`;
      if (control.errors['email']) return 'Invalid email address';
    }
    return '';
  }
}
