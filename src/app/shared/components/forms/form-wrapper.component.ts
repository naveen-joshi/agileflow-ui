import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-lg p-8">
      @if (title() || subtitle()) {
      <div class="text-center mb-8">
        @if (title()) {
        <h1 class="text-2xl font-bold text-gray-900">{{ title() }}</h1>
        } @if (subtitle()) {
        <p class="text-gray-600 mt-1">{{ subtitle() }}</p>
        }
      </div>
      }

      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 28rem;
        width: 100%;
        margin: 0 auto;
      }
    `,
  ],
})
export class FormWrapperComponent {
  title = input<string>('');
  subtitle = input<string>('');
}
