import { Component, Injectable, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DialogRef, DialogService } from '@ngneat/dialog';
import { Observable } from 'rxjs';

interface ConfirmationOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  private dialogService = inject(DialogService);

  confirm(options: ConfirmationOptions): Observable<boolean> {
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      data: options,
    });

    return dialogRef.afterClosed$;
  }
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div class="p-6">
      <h2 class="text-lg font-semibold mb-4">
        {{ config.data.title || 'Confirm' }}
      </h2>
      <p class="text-gray-600 mb-6">{{ config.data.message }}</p>
      <div class="flex justify-end gap-3">
        <button mat-stroked-button (click)="ref.close(false)">
          {{ config.data.cancelText || 'Cancel' }}
        </button>
        <button
          mat-flat-button
          [color]="config.data.type === 'danger' ? 'warn' : 'primary'"
          (click)="ref.close(true)"
        >
          {{ config.data.confirmText || 'Confirm' }}
        </button>
      </div>
    </div>
  `,
})
export class ConfirmationDialogComponent {
  constructor(
    public ref: DialogRef,
    public config: DialogRef<ConfirmationOptions>
  ) {}
}
