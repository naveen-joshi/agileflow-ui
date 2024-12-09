import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

export interface RadioOption {
  label: string;
  value: any;
  disabled?: boolean;
}

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true,
    },
  ],
})
export class RadioComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() options: RadioOption[] = [];
  @Input() required = false;
  @Input() disabled = false;
  @Input() error = '';
  @Input() hint = '';
  @Input() inline = false;

  value: any = null;
  touched = false;

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
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

  onSelect(option: RadioOption): void {
    if (!this.disabled && !option.disabled) {
      this.value = option.value;
      this.onChange(this.value);
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
