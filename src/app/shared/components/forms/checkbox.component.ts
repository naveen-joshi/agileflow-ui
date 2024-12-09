import { Component, input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label class="inline-flex items-center">
      <input
        type="checkbox"
        [id]="id()"
        [checked]="checked()"
        [disabled]="disabled()"
        (change)="onChange($event)"
        class="
          w-4 h-4 rounded
          border-gray-300 text-primary-600
          focus:ring-primary-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
        "
      />
      <span
        [class]="[
          'ml-2 text-sm',
          disabled() ? 'text-gray-500' : 'text-gray-700'
        ]"
      >
        {{ label() }}
      </span>
    </label>
  `,
})
export class CheckboxComponent {
  id = input<string>('');
  label = input<string>('');
  checked = input<boolean>(false);
  disabled = input<boolean>(false);

  @Output() checkedChange = new EventEmitter<boolean>();

  onChange(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.checkedChange.emit(checked);
  }
}
