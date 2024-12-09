import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() error = '';
  @Input() hint = '';

  checked = false;
  touched = false;

  onChange = (value: boolean) => {};
  onTouched = () => {};

  writeValue(value: boolean): void {
    this.checked = value;
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

  onToggle(): void {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.onChange(this.checked);
      this.markAsTouched();
    }
  }

  markAsTouched(): void {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
}
