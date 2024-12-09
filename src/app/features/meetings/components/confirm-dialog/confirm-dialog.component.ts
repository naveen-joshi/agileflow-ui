import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ButtonComponent } from '@shared/components/button/button.component';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">{{ data.title }}</h2>
      <p class="text-gray-600 mb-6">{{ data.message }}</p>
      <div class="flex justify-end gap-2">
        <app-button
          variant="secondary"
          (click)="dialogRef.close(false)"
        >
          {{ data.cancelText || 'Cancel' }}
        </app-button>
        <app-button
          variant="danger"
          (click)="dialogRef.close(true)"
        >
          {{ data.confirmText || 'Confirm' }}
        </app-button>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
