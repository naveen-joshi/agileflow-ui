import { Component, input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-input',
  standalone: true,
  imports: [CommonModule],
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

      <div
        class="
          mt-1 flex justify-center px-6 py-4
          border-2 border-dashed rounded-lg
          hover:bg-gray-50 transition-colors
          {{ error() ? 'border-red-300' : 'border-gray-300' }}
          {{ disabled() ? 'bg-gray-50 cursor-not-allowed' : 'cursor-pointer' }}
        "
        (dragover)="onDragOver($event)"
        (dragleave)="isDragging = false"
        (drop)="onDrop($event)"
      >
        <div class="text-center">
          <i class="material-icons text-gray-400 text-3xl mb-2">upload_file</i>
          <div class="text-sm text-gray-600">
            <label [for]="id()" class="cursor-pointer">
              <span class="text-primary-600 hover:text-primary-500">
                Upload a file
              </span>
              or drag and drop
            </label>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            {{ accept() ? accept().split(',').join(', ') : 'Any file' }} up to
            {{ maxSize() }}MB
          </p>
        </div>
        <input
          [id]="id()"
          type="file"
          class="sr-only"
          [accept]="accept()"
          [disabled]="disabled()"
          [required]="required()"
          (change)="onFileSelected($event)"
        />
      </div>

      @if (error()) {
      <p class="mt-1 text-sm text-red-500">{{ error() }}</p>
      }
    </div>
  `,
})
export class FileInputComponent {
  id = input<string>('');
  label = input<string>('');
  accept = input<string>('');
  maxSize = input<number>(5); // MB
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  error = input<string>('');
  errorChange = new EventEmitter<string>();

  fileChange = new EventEmitter<File>();

  protected isDragging = false;

  protected onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled()) {
      this.isDragging = true;
    }
  }

  protected onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (this.disabled()) return;

    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.handleFile(files[0]);
    }
  }

  protected onFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files?.length) {
      this.handleFile(files[0]);
    }
  }

  private handleFile(file: File) {
    if (this.maxSize() && file.size > this.maxSize() * 1024 * 1024) {
      this.errorChange.emit(`File size must be less than ${this.maxSize()}MB`);
      return;
    }

    if (
      this.accept() &&
      !this.accept()
        .split(',')
        .some((type) =>
          file.type.match(new RegExp(type.trim().replace('*', '.*')))
        )
    ) {
      this.errorChange.emit('Invalid file type');
      return;
    }

    this.errorChange.emit('');
    this.fileChange.emit(file);
  }
}
