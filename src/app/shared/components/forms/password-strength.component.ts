import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StrengthCheck {
  label: string;
  met: boolean;
}

@Component({
  selector: 'app-password-strength',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-1 space-y-2">
      <div class="flex gap-2">
        @for (level of strengthLevels(); track level) {
        <div
          class="h-2 flex-1 rounded-full transition-colors duration-200"
          [class]="getStrengthColor(level)"
        ></div>
        }
      </div>

      <div class="space-y-1 text-sm">
        @for (check of strengthChecks(); track check.label) {
        <div class="flex items-center gap-1">
          <i
            class="material-icons text-base"
            [class]="check.met ? 'text-green-500' : 'text-gray-300'"
          >
            {{ check.met ? 'check_circle' : 'radio_button_unchecked' }}
          </i>
          <span class="text-gray-600">{{ check.label }}</span>
        </div>
        }
      </div>
    </div>
  `,
})
export class PasswordStrengthComponent {
  password = input<string>('');

  protected strengthChecks = computed(() => [
    {
      label: 'At least 8 characters',
      met: (this.password()?.length ?? 0) >= 8,
    },
    {
      label: 'Contains uppercase letter',
      met: /[A-Z]/.test(this.password() ?? ''),
    },
    {
      label: 'Contains lowercase letter',
      met: /[a-z]/.test(this.password() ?? ''),
    },
    { label: 'Contains number', met: /\d/.test(this.password() ?? '') },
    {
      label: 'Contains special character',
      met: /[!@#$%^&*]/.test(this.password() ?? ''),
    },
  ]);

  protected strengthLevels = computed(() => {
    const metChecks = this.strengthChecks().filter((check) => check.met).length;
    return ['weak', 'fair', 'good', 'strong'].slice(
      0,
      Math.ceil(metChecks / 1.25)
    );
  });

  protected getStrengthColor(level: string): string {
    const colors = {
      weak: 'bg-red-500',
      fair: 'bg-yellow-500',
      good: 'bg-green-400',
      strong: 'bg-green-600',
    };
    return colors[level as keyof typeof colors];
  }
}
