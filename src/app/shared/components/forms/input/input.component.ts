import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'datetime-local' = 'text';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() error = '';
  @Input() hint = '';
  @Input() icon = '';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() control?: AbstractControl | null = null;
  @Input() showError?: boolean = false;
  @Input() errorMessage?: string = '';

  value = '';
  touched = false;

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value);
  }

  markAsTouched(): void {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
}
