import { Component, computed, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrganizationService } from '../../../core/services/organization.service';
import { TeamRole } from '../../../shared/interfaces/team.interface';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmationService } from '../../../shared/services/confirmation.service';
import { Subject, takeUntil, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-team-invitation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgSelectModule,
  ],
  template: `
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900">Team Members</h2>
              <button
                mat-flat-button
                color="primary"
                (click)="showInviteForm.set(true)"
                *ngIf="!showInviteForm()"
              >
                <mat-icon>person_add</mat-icon>
                Invite Member
              </button>
            </div>
          </div>

          <!-- Invite Form -->
          @if (showInviteForm()) {
          <div class="p-6 border-b border-gray-200">
            <form
              [formGroup]="inviteForm"
              (ngSubmit)="onSubmit()"
              class="space-y-4"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    for="email"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    formControlName="email"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Enter email address"
                  />
                  @if (email?.errors?.['required'] && email?.touched) {
                  <p class="mt-1 text-sm text-red-600">Email is required</p>
                  } @if (email?.errors?.['email'] && email?.touched) {
                  <p class="mt-1 text-sm text-red-600">
                    Please enter a valid email
                  </p>
                  }
                </div>

                <div>
                  <label
                    for="role"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Role
                  </label>
                  <ng-select
                    [items]="roles"
                    bindLabel="name"
                    bindValue="value"
                    placeholder="Select role"
                    formControlName="role"
                  >
                  </ng-select>
                  @if (role?.errors?.['required'] && role?.touched) {
                  <p class="mt-1 text-sm text-red-600">Role is required</p>
                  }
                </div>
              </div>

              <div class="flex justify-end gap-3">
                <button
                  type="button"
                  mat-stroked-button
                  (click)="showInviteForm.set(false)"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  mat-flat-button
                  color="primary"
                  [disabled]="inviteForm.invalid || isSubmitting()"
                >
                  <span class="flex items-center gap-2">
                    @if (isSubmitting()) {
                    <mat-spinner diameter="20" />
                    Sending... } @else { Send Invitation }
                  </span>
                </button>
              </div>
            </form>
          </div>
          }

          <!-- Team Members List -->
          <div class="divide-y divide-gray-200">
            @for (member of teamMembers(); track member.id) {
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  @if (member.user.avatar) {
                  <img
                    [src]="member.user.avatar"
                    [alt]="member.user.name"
                    class="h-10 w-10 rounded-full"
                  />
                  } @else {
                  <div
                    class="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium text-lg"
                  >
                    {{ member.user.name[0].toUpperCase() }}
                  </div>
                  }
                  <div>
                    <h3 class="text-sm font-medium text-gray-900">
                      {{ member.user.name }}
                    </h3>
                    <p class="text-sm text-gray-500">{{ member.user.email }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <ng-select
                    [items]="roles"
                    bindLabel="name"
                    bindValue="value"
                    [clearable]="false"
                    [searchable]="false"
                    [(ngModel)]="member.role"
                    (change)="onRoleChange(member.id, $event)"
                    [disabled]="member.role === 'owner'"
                    class="w-40"
                  >
                  </ng-select>

                  @if (member.role !== 'owner') {
                  <button
                    mat-icon-button
                    color="warn"
                    (click)="onRemoveMember(member)"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
                  }
                </div>
              </div>
            </div>
            } @if (!teamMembers().length) {
            <div class="p-6 text-center text-gray-500">
              No team members found
            </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TeamInvitationComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private organizationService = inject(OrganizationService);
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);
  private destroy$ = new Subject<void>();

  // UI state
  showInviteForm = signal(false);
  isSubmitting = signal(false);

  // Data
  teamMembers = this.organizationService.teamMembersList;
  currentOrg = this.organizationService.currentOrg;

  // Form
  inviteForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    role: ['member' as TeamRole, Validators.required],
  });

  get email() {
    return this.inviteForm.get('email');
  }

  get role() {
    return this.inviteForm.get('role');
  }

  // Role options
  roles = [
    { value: 'admin', name: 'Admin' },
    { value: 'member', name: 'Member' },
    { value: 'guest', name: 'Guest' },
  ];

  onSubmit() {
    if (this.inviteForm.valid && this.currentOrg()) {
      this.isSubmitting.set(true);

      this.organizationService
        .inviteTeamMember(this.currentOrg()!.id, this.inviteForm.getRawValue())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.showInviteForm.set(false);
            this.inviteForm.reset({ role: 'member' });
          },
          error: () => {
            this.isSubmitting.set(false);
          },
        });
    }
  }

  onRoleChange(memberId: string, role: TeamRole) {
    this.organizationService.updateTeamMemberRole(memberId, role);
  }

  async onRemoveMember(member: { id: string; user: { name: string } }) {
    const confirmed = await firstValueFrom(
      this.confirmationService.confirm({
        title: 'Remove Team Member',
        message: `Are you sure you want to remove ${member.user.name} from the team?`,
        confirmText: 'Remove',
        cancelText: 'Cancel',
        type: 'danger',
      })
    );

    if (confirmed) {
      this.organizationService.removeTeamMember(member.id);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
