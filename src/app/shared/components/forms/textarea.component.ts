import { Component, input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative">
      @if (label()) {
      <label [for]="id()" class="block text-sm font-medium text-gray-700 mb-1">
        {{ label() }}
        @if (required()) {
        <span class="text-red-500">*</span>
        }
      </label>
      }

      <textarea
        [id]="id()"
        [rows]="rows()"
        [placeholder]="placeholder()"
        [value]="value()"
        [disabled]="disabled()"
        [required]="required()"
        (input)="onInput($event)"
        [class]="textareaClasses()"
        [attr.aria-label]="label() || placeholder()"
        [attr.aria-invalid]="!!error()"
      ></textarea>

      @if (error()) {
      <p class="mt-1 text-sm text-red-500">{{ error() }}</p>
      } @if (hint()) {
      <p class="mt-1 text-sm text-gray-500">{{ hint() }}</p>
      }
    </div>
  `,
})
export class TextareaComponent {
  // Inputs
  id = input<string>('');
  label = input<string>('');
  placeholder = input<string>('');
  value = input<string>('');
  hint = input<string>('');
  error = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  rows = input<number>(3);

  // Outputs
  valueChange = new EventEmitter<string>();

  protected textareaClasses() {
    return [
      'block w-full rounded-lg border',
      'px-3 py-2 text-gray-900 placeholder:text-gray-400',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
      'transition duration-150 ease-in-out resize-y',
      this.error() ? 'border-red-300' : 'border-gray-300',
      this.disabled()
        ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
        : 'bg-white',
    ].join(' ');
  }

  protected onInput(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.valueChange.emit(value);
  }
}
