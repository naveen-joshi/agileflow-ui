import { Component, input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label class="inline-flex items-center">
      <input
        type="radio"
        [id]="id()"
        [name]="name()"
        [value]="value()"
        [checked]="checked()"
        [disabled]="disabled()"
        (change)="onChange($event)"
        class="
          w-4 h-4
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
export class RadioComponent {
  id = input<string>('');
  name = input<string>('');
  label = input<string>('');
  value = input<string>('');
  checked = input<boolean>(false);
  disabled = input<boolean>(false);

  valueChange = new EventEmitter<string>();

  onChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(value);
  }
}
