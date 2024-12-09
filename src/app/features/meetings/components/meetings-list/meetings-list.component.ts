import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DialogService } from '@ngneat/dialog';
import { MeetingsService, Meeting } from '../../services/meetings.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { EditMeetingDialogComponent } from '../edit-meeting-dialog/edit-meeting-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-meetings-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    ButtonComponent,
    ConfirmDialogComponent,
  ],
  template: `
    <div class="p-6">
      <header class="mb-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Scheduled Meetings</h1>
        <app-button routerLink="../schedule">
          Schedule Meeting
        </app-button>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (meeting of meetings(); track meeting.id) {
        <mat-card class="mb-4">
          <mat-card-header>
            <mat-card-title>{{ meeting.title }}</mat-card-title>
            <mat-card-subtitle>
              {{ meeting.datetime | date : 'medium' }}
            </mat-card-subtitle>
            <div class="ml-auto">
              <button mat-icon-button [matMenuTriggerFor]="meetingMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #meetingMenu="matMenu">
                <button mat-menu-item (click)="editMeeting(meeting)">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="cancelMeeting(meeting)">
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            </div>
          </mat-card-header>

          <mat-card-content class="mt-4">
            <div class="flex items-center gap-2 text-gray-600 mb-2">
              <mat-icon class="text-lg">schedule</mat-icon>
              <span>{{ meeting.duration }} minutes</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <mat-icon class="text-lg">group</mat-icon>
              <span>{{ meeting.participants.length }} participants</span>
            </div>
            <div class="mt-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                [ngClass]="{
                  'bg-blue-100 text-blue-800': meeting.status === 'scheduled',
                  'bg-green-100 text-green-800': meeting.status === 'in_progress',
                  'bg-gray-100 text-gray-800': meeting.status === 'completed',
                  'bg-red-100 text-red-800': meeting.status === 'cancelled'
                }"
              >
                {{ meeting.status | titlecase }}
              </span>
            </div>
          </mat-card-content>

          <mat-card-actions align="end">
            <app-button
              [routerLink]="['/meetings/join', meeting.id]"
              [disabled]="meeting.status === 'cancelled' || meeting.status === 'completed'"
            >
              Join Meeting
            </app-button>
          </mat-card-actions>
        </mat-card>
        } @if (meetings().length === 0) {
        <div class="col-span-full text-center py-12">
          <mat-icon class="text-6xl text-gray-400">calendar_today</mat-icon>
          <p class="mt-4 text-gray-600">No meetings scheduled</p>
          <app-button
            routerLink="../schedule"
            class="mt-4"
          >
            Schedule a Meeting
          </app-button>
        </div>
        }
      </div>
    </div>
  `,
})
export class MeetingsListComponent {
  private meetingsService = inject(MeetingsService);
  private dialog = inject(DialogService);
  protected meetings = this.meetingsService.meetings;

  async editMeeting(meeting: Meeting) {
    const dialogRef = this.dialog.open(EditMeetingDialogComponent, {
      data: meeting,
    });

    const result = await dialogRef.afterClosed$.toPromise();
    if (result) {
      await this.meetingsService.updateMeeting(result.id, result);
    }
  }

  async cancelMeeting(meeting: Meeting) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Cancel Meeting',
        message: 'Are you sure you want to cancel this meeting? This action cannot be undone.',
        confirmText: 'Yes, Cancel Meeting',
        cancelText: 'No, Keep It'
      }
    });

    const result = await dialogRef.afterClosed$.toPromise();
    if (result) {
      await this.meetingsService.cancelMeeting(meeting.id);
    }
  }
}
