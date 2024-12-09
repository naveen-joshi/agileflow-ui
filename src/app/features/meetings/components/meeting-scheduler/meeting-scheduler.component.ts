import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/forms/input/input.component';
import { MeetingsService } from '../../services/meetings.service';
import { Router } from '@angular/router';

interface DurationOption {
  id: number;
  label: string;
}

@Component({
  selector: 'app-meeting-scheduler',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    ButtonComponent,
    InputComponent,
  ],
  template: `
    <div class="max-w-2xl mx-auto p-6">
      <form [formGroup]="schedulerForm" (ngSubmit)="scheduleMeeting()" class="space-y-6">
        <h2 class="text-2xl font-semibold mb-6">Schedule a Meeting</h2>

        <div>
          <app-input
            label="Meeting Title"
            [control]="schedulerForm.get('title')"
            [showError]="schedulerForm.get('title')?.touched && schedulerForm.get('title')?.invalid"
            errorMessage="Title is required"
          ></app-input>
        </div>

        <div>
          <app-input
            type="datetime-local"
            label="Date & Time"
            [control]="schedulerForm.get('datetime')"
            [showError]="schedulerForm.get('datetime')?.touched && schedulerForm.get('datetime')?.invalid"
            errorMessage="Date and time is required"
          ></app-input>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <ng-select
            [items]="durationOptions"
            [clearable]="false"
            bindLabel="label"
            bindValue="id"
            formControlName="duration"
            placeholder="Select duration"
          >
          </ng-select>
          <div 
            *ngIf="schedulerForm.get('duration')?.touched && schedulerForm.get('duration')?.invalid"
            class="text-red-500 text-sm mt-1"
          >
            Duration is required
          </div>
        </div>

        <div class="flex justify-end">
          <app-button
            type="submit"
            [disabled]="schedulerForm.invalid || isSubmitting"
          >
            {{ isSubmitting ? 'Scheduling...' : 'Schedule Meeting' }}
          </app-button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host ::ng-deep .ng-select {
      @apply border border-gray-300 rounded-md;
    }
    :host ::ng-deep .ng-select .ng-select-container {
      @apply min-h-[42px];
    }
  `]
})
export class MeetingSchedulerComponent {
  private fb = inject(FormBuilder);
  private meetingsService = inject(MeetingsService);
  private router = inject(Router);

  protected isSubmitting = false;

  protected durationOptions: DurationOption[] = [
    { id: 30, label: '30 minutes' },
    { id: 60, label: '1 hour' },
    { id: 90, label: '1.5 hours' },
    { id: 120, label: '2 hours' }
  ];

  protected schedulerForm = this.fb.group({
    title: ['', [Validators.required]],
    datetime: ['', [Validators.required]],
    duration: [null, [Validators.required]]
  });

  async scheduleMeeting() {
    if (this.schedulerForm.invalid) return;

    try {
      this.isSubmitting = true;
      const formValue = this.schedulerForm.value;
      
      await this.meetingsService.scheduleMeeting({
        title: formValue.title!,
        datetime: new Date(formValue.datetime!),
        duration: formValue.duration!
      });

      await this.router.navigate(['/meetings']);
    } catch (error) {
      console.error('Failed to schedule meeting:', error);
    } finally {
      this.isSubmitting = false;
    }
  }
}
