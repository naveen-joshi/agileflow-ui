import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="message()"
      class="flex items-center gap-1 mt-1 text-sm text-red-500"
      role="alert"
    >
      <i class="material-icons text-base">error_outline</i>
      {{ message() }}
    </div>
  `,
})
export class FormErrorComponent {
  message = input<string>('');
}
