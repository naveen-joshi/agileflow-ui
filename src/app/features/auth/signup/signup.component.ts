import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { InputComponent } from '@shared/components/forms/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CheckboxComponent } from '@shared/components/forms/checkbox.component';
import { LinkComponent } from '@shared/components/link/link.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    CheckboxComponent,
    LinkComponent,
  ],
  template: `
    <div class="space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-3">
          Create your account
        </h2>
        <p class="text-base text-gray-600">
          Already have an account?
          <app-link to="/auth/login" variant="primary" class="ml-1">
            Sign in
          </app-link>
        </p>
      </div>

      <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div class="space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <app-input
              label="First name"
              formControlName="firstName"
              [required]="true"
              [error]="getError('firstName')"
            />
            <app-input
              label="Last name"
              formControlName="lastName"
              [required]="true"
              [error]="getError('lastName')"
            />
          </div>

          <app-input
            type="email"
            label="Email address"
            formControlName="email"
            [required]="true"
            [error]="getError('email')"
          />

          <app-input
            type="password"
            label="Password"
            formControlName="password"
            [required]="true"
            [error]="getError('password')"
          />

          <div class="pt-2">
            <app-checkbox
              label="I agree to the Terms of Service and Privacy Policy"
              formControlName="terms"
            />
          </div>
        </div>

        <div class="pt-4">
          <app-button
            type="submit"
            variant="primary"
            [fullWidth]="true"
            [loading]="isLoading"
            [disabled]="!signupForm.valid || isLoading"
          >
            Create account
          </app-button>
        </div>
      </form>
    </div>
  `,
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  isLoading = false;

  signupForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    terms: [false, Validators.requiredTrue],
  });

  getError(field: string): string {
    const control = this.signupForm.get(field);
    if (control?.touched && control.errors) {
      if (control.errors['required']) return `${field} is required`;
      if (control.errors['email']) return 'Invalid email address';
      if (control.errors['minlength'])
        return 'Password must be at least 8 characters';
    }
    return '';
  }

  async onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      try {
        await this.authService.signup(this.signupForm.value);
      } catch (error) {
        // Handle error
      } finally {
        this.isLoading = false;
      }
    }
  }
}
