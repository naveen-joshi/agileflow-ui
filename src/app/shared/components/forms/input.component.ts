import { Component, computed, input, model, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
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

      <div class="relative">
        @if (icon()) {
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <i [class]="icon()"></i>
          </span>
        }

        <input
          [id]="id()"
          [type]="type()"
          [placeholder]="placeholder()"
          [value]="value()"
          [disabled]="disabled()"
          [required]="required()"
          (input)="onInput($event)"
          (blur)="onTouched()"
          [class]="inputClasses()"
          [attr.aria-invalid]="!!error()"
          [attr.aria-describedby]="error() ? id() + '-error' : null"
        />

        @if (error()) {
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <i class="fas fa-exclamation-circle text-red-500"></i>
          </div>
        }
      </div>

      @if (error()) {
        <p [id]="id() + '-error'" class="mt-1 text-sm text-red-600">{{ error() }}</p>
      }
    </div>
  `
})
export class InputComponent implements ControlValueAccessor {
  // Input signals
  id = input<string>('input-' + Math.random().toString(36).slice(2, 11));
  type = input<string>('text');
  label = input<string>('');
  placeholder = input<string>('');
  icon = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  error = input<string>('');

  // Internal value signal
  value = model<string>('');
  @Output() valueChange = new EventEmitter<string>();

  // Form control handlers
  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  // Computed styles
  protected inputClasses = computed(() => {
    return [
      'block w-full rounded-lg border',
      'px-3 py-2 text-gray-900 placeholder:text-gray-400',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
      'transition duration-150 ease-in-out',
      this.icon() ? 'pl-10' : '',
      this.error() ? 'border-red-300 pr-10' : 'border-gray-300',
      this.disabled()
        ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
        : 'bg-white',
    ].join(' ');
  });

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Angular will handle the disabled input signal automatically
  }

  // Event handlers
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }
}
