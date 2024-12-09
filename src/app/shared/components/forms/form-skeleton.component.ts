import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'space-y-' + spacing()">
      @for (item of items(); track item) {
      <div class="animate-pulse">
        @if (item.label) {
        <div class="h-4 w-24 bg-gray-200 rounded mb-1"></div>
        }
        <div
          class="h-10 bg-gray-200 rounded-lg"
          [class.w-full]="item.fullWidth"
          [style.width]="item.fullWidth ? '100%' : item.width"
        ></div>
      </div>
      }
    </div>
  `,
})
export class FormSkeletonComponent {
  items = input<
    Array<{ label?: boolean; fullWidth?: boolean; width?: string }>
  >([]);
  spacing = input<number>(4);
}
