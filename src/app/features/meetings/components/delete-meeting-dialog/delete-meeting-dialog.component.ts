import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent } from '@shared/components/button/button.component';
import { Meeting } from '../../services/meetings.service';

@Component({
  selector: 'app-delete-meeting-dialog',
  standalone: true,
  imports: [],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">Cancel Meeting</h2>
      <p class="text-gray-600 mb-6">Are you sure you want to cancel this meeting? This action cannot be undone.</p>
      <div class="flex justify-end gap-2">
        <button 
          pButton 
          label="No, Keep It" 
          class="p-button-secondary" 
          (click)="dialogRef.close(false)"
        ></button>
        <button 
          pButton 
          label="Yes, Cancel Meeting" 
          class="p-button-danger" 
          (click)="dialogRef.close(true)"
        ></button>
      </div>
    </div>
  `
})
export class DeleteMeetingDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteMeetingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Meeting
  ) {}
}
