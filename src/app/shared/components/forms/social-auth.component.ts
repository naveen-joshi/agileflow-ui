import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

interface SocialProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-social-auth',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-white text-gray-500">{{ dividerText() }}</span>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-2 gap-3">
      @for (provider of providers(); track provider.id) {
      <app-button
        variant="outline"
        [fullWidth]="true"
        [icon]="provider.icon"
        iconPosition="left"
        (click)="onProviderClick(provider.id)"
      >
        {{ provider.name }}
      </app-button>
      }
    </div>
  `,
})
export class SocialAuthComponent {
  dividerText = input<string>('Or continue with');
  providers = input<SocialProvider[]>([
    { id: 'google', name: 'Google', icon: 'google', color: 'text-red-600' },
    { id: 'github', name: 'GitHub', icon: 'github', color: 'text-gray-900' },
  ]);

  protected onProviderClick(providerId: string): void {
    // Implement social auth logic
    console.log(`Authenticating with ${providerId}`);
  }
}
