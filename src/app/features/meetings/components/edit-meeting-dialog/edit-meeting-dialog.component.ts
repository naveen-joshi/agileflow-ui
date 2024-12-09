import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef } from '@ngneat/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonComponent } from '@shared/components/button/button.component';
import { Meeting } from '../../services/meetings.service';
import { InputComponent } from '@shared/components/forms/input.component';

@Component({
  selector: 'app-edit-meeting-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    ButtonComponent,
    InputComponent
  ],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">Edit Meeting</h2>
      
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <app-input
          label="Title"
          formControlName="title"
          [error]="form.get('title')?.errors?.['required'] ? 'Title is required' : ''"
        />

        <div class="flex gap-4">
          <app-input
            type="datetime-local"
            label="Date & Time"
            formControlName="datetime"
            [error]="form.get('datetime')?.errors?.['required'] ? 'Date & Time is required' : ''"
            class="flex-1"
          />
          
          <app-input
            type="number"
            label="Duration (minutes)"
            formControlName="duration"
            [error]="form.get('duration')?.errors?.['required'] ? 'Duration is required' : ''"
            class="flex-1"
          />
        </div>

        <ng-select
          [items]="statusOptions"
          formControlName="status"
          bindLabel="label"
          bindValue="value"
          placeholder="Select status"
          class="mt-4"
        />

        <div class="flex justify-end gap-2 mt-6">
          <app-button
            variant="secondary"
            (click)="ref.close()"
          >
            Cancel
          </app-button>
          <app-button
            type="submit"
            [disabled]="!form.valid"
          >
            Save Changes
          </app-button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-width: 500px;
    }
    
    ::ng-deep .ng-select {
      .ng-select-container {
        @apply rounded border border-gray-300 bg-white px-3 py-2;
      }
      
      &.ng-select-focused .ng-select-container {
        @apply border-primary-500 ring-1 ring-primary-500;
      }
    }
  `]
})
export class EditMeetingDialogComponent {
  private fb = inject(FormBuilder);
  ref = inject(DialogRef);

  meeting: Meeting = this.ref.data;

  statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  form: FormGroup = this.fb.group({
    title: [this.meeting.title, Validators.required],
    datetime: [this.formatDateTime(this.meeting.datetime), Validators.required],
    duration: [this.meeting.duration, Validators.required],
    status: [this.meeting.status, Validators.required]
  });

  private formatDateTime(date: Date): string {
    return new Date(date).toISOString().slice(0, 16);
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      this.ref.close({
        ...formValue,
        datetime: new Date(formValue.datetime),
        id: this.meeting.id
      });
    }
  }
}
