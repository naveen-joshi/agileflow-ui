import { Component, input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative">
      <div
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <i class="material-icons text-gray-400 text-lg">search</i>
      </div>
      <input
        type="search"
        [id]="id()"
        [placeholder]="placeholder()"
        [value]="value()"
        [disabled]="disabled()"
        (input)="onInput($event)"
        class="
          block w-full pl-10 pr-3 py-2
          border border-gray-300 rounded-lg
          bg-white text-gray-900 placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          transition duration-150 ease-in-out
        "
      />
      @if (value()) {
      <button
        type="button"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
        (click)="onClear()"
      >
        <i class="material-icons text-gray-400 text-lg hover:text-gray-500"
          >close</i
        >
      </button>
      }
    </div>
  `,
})
export class SearchInputComponent {
  id = input<string>('');
  placeholder = input<string>('Search...');
  value = input<string>('');
  disabled = input<boolean>(false);

  valueChange = new EventEmitter<string>();

  protected onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(value);
  }

  protected onClear() {
    this.valueChange.emit('');
  }
}
