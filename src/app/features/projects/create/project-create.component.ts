import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { OrganizationService } from '../../../core/services/organization.service';
import { ToastService } from '../../../core/services/toast.service';
import { ProjectMethodology } from '../../../shared/interfaces/project.interface';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgSelectModule,
  ],
  template: `
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Create New Project</h1>
          <p class="mt-2 text-gray-600">
            Set up your project and start collaborating with your team
          </p>
        </div>

        <mat-stepper
          [linear]="true"
          #stepper
          class="bg-white shadow-lg rounded-lg"
        >
          <!-- Basic Info Step -->
          <mat-step [stepControl]="basicInfoForm">
            <ng-template matStepLabel>Project Information</ng-template>
            <form [formGroup]="basicInfoForm" class="py-8 px-6">
              <div class="space-y-6">
                <div>
                  <label
                    for="name"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Project Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    formControlName="name"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Enter project name"
                  />
                  @if (name?.errors?.['required'] && name?.touched) {
                  <p class="mt-1 text-sm text-red-600">
                    Project name is required
                  </p>
                  }
                </div>

                <div>
                  <label
                    for="key"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Project Key
                  </label>
                  <input
                    type="text"
                    id="key"
                    formControlName="key"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 uppercase"
                    placeholder="Enter project key (e.g., PRJ)"
                  />
                  @if (key?.errors?.['required'] && key?.touched) {
                  <p class="mt-1 text-sm text-red-600">
                    Project key is required
                  </p>
                  } @if (key?.errors?.['pattern'] && key?.touched) {
                  <p class="mt-1 text-sm text-red-600">
                    Project key must be 2-10 uppercase letters
                  </p>
                  }
                </div>

                <div>
                  <label
                    for="description"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    formControlName="description"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Enter project description"
                  ></textarea>
                </div>
              </div>

              <div class="mt-8 flex justify-end">
                <button
                  mat-flat-button
                  color="primary"
                  matStepperNext
                  [disabled]="basicInfoForm.invalid"
                >
                  Next
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
            </form>
          </mat-step>

          <!-- Methodology Step -->
          <mat-step [stepControl]="methodologyForm">
            <ng-template matStepLabel>Project Methodology</ng-template>
            <form [formGroup]="methodologyForm" class="py-8 px-6">
              <div class="space-y-6">
                <div>
                  <label
                    for="methodology"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Project Methodology
                  </label>
                  <ng-select
                    [items]="methodologies"
                    bindLabel="name"
                    bindValue="value"
                    placeholder="Select methodology"
                    formControlName="methodology"
                  >
                  </ng-select>
                </div>

                <div>
                  <label
                    for="estimationType"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Estimation Type
                  </label>
                  <ng-select
                    [items]="estimationTypes"
                    bindLabel="name"
                    bindValue="value"
                    placeholder="Select estimation type"
                    formControlName="estimationType"
                  >
                  </ng-select>
                </div>

                @if (methodologyForm.get('methodology')?.value === 'scrum') {
                <div>
                  <label
                    for="sprintDuration"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Sprint Duration
                  </label>
                  <ng-select
                    [items]="sprintDurations"
                    bindLabel="name"
                    bindValue="value"
                    placeholder="Select sprint duration"
                    formControlName="sprintDuration"
                  >
                  </ng-select>
                </div>
                }

                <div>
                  <label
                    for="defaultColumns"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Board Columns
                  </label>
                  <ng-select
                    [items]="boardColumns"
                    [multiple]="true"
                    bindLabel="name"
                    bindValue="value"
                    placeholder="Select board columns"
                    formControlName="defaultColumns"
                  >
                  </ng-select>
                </div>

                <div>
                  <label
                    for="workingDays"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Working Days
                  </label>
                  <ng-select
                    [items]="weekDays"
                    [multiple]="true"
                    bindLabel="name"
                    bindValue="value"
                    placeholder="Select working days"
                    formControlName="workingDays"
                  >
                  </ng-select>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      for="workingHoursStart"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Working Hours Start
                    </label>
                    <input
                      type="time"
                      id="workingHoursStart"
                      formControlName="workingHoursStart"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label
                      for="workingHoursEnd"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Working Hours End
                    </label>
                    <input
                      type="time"
                      id="workingHoursEnd"
                      formControlName="workingHoursEnd"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div class="mt-8 flex justify-between">
                <button mat-stroked-button matStepperPrevious>
                  <mat-icon>arrow_back</mat-icon>
                  Back
                </button>
                <button
                  mat-flat-button
                  color="primary"
                  (click)="onSubmit()"
                  [disabled]="methodologyForm.invalid || isSubmitting()"
                >
                  <span class="flex items-center gap-2">
                    @if (isSubmitting()) {
                    <mat-spinner diameter="20" />
                    Creating... } @else { Create Project }
                  </span>
                </button>
              </div>
            </form>
          </mat-step>
        </mat-stepper>
      </div>
    </div>
  `,
})
export class ProjectCreateComponent {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private organizationService = inject(OrganizationService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  isSubmitting = signal(false);
  currentOrg = this.organizationService.currentOrg;

  // Form groups
  basicInfoForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    key: ['', [Validators.required, Validators.pattern(/^[A-Z]{2,10}$/)]],
    description: [''],
  });

  methodologyForm = this.fb.nonNullable.group({
    methodology: ['scrum' as ProjectMethodology, Validators.required],
    estimationType: ['story_points', Validators.required],
    sprintDuration: [2],
    defaultColumns: [
      [] as string[],
      [Validators.required, Validators.minLength(1)],
    ],
    workingDays: [
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      [Validators.required, Validators.minLength(1)],
    ],
    workingHoursStart: ['09:00', Validators.required],
    workingHoursEnd: ['17:00', Validators.required],
  });

  // Form getters
  get name() {
    return this.basicInfoForm.get('name');
  }

  get key() {
    return this.basicInfoForm.get('key');
  }

  // Select options
  methodologies = [
    { value: 'scrum', name: 'Scrum' },
    { value: 'kanban', name: 'Kanban' },
  ];

  estimationTypes = [
    { value: 'story_points', name: 'Story Points' },
    { value: 'hours', name: 'Hours' },
  ];

  sprintDurations = [
    { value: 1, name: '1 Week' },
    { value: 2, name: '2 Weeks' },
    { value: 3, name: '3 Weeks' },
    { value: 4, name: '4 Weeks' },
  ];

  boardColumns = [
    { value: 'backlog', name: 'Backlog' },
    { value: 'todo', name: 'To Do' },
    { value: 'in_progress', name: 'In Progress' },
    { value: 'in_review', name: 'In Review' },
    { value: 'done', name: 'Done' },
  ];

  weekDays = [
    { value: 'monday', name: 'Monday' },
    { value: 'tuesday', name: 'Tuesday' },
    { value: 'wednesday', name: 'Wednesday' },
    { value: 'thursday', name: 'Thursday' },
    { value: 'friday', name: 'Friday' },
    { value: 'saturday', name: 'Saturday' },
    { value: 'sunday', name: 'Sunday' },
  ];

  onSubmit() {
    if (
      this.basicInfoForm.valid &&
      this.methodologyForm.valid &&
      this.currentOrg()
    ) {
      this.isSubmitting.set(true);

      const basicInfo = this.basicInfoForm.getRawValue();
      const methodology = this.methodologyForm.getRawValue();

      this.projectService
        .createProject({
          ...basicInfo,
          organizationId: this.currentOrg()!.id,
          methodology: methodology.methodology,
          settings: {
            estimationType: methodology.estimationType as
              | 'story_points'
              | 'hours',
            sprintDuration:
              methodology.methodology === 'scrum'
                ? methodology.sprintDuration
                : undefined,
            defaultColumns: methodology.defaultColumns,
            workingDays: methodology.workingDays,
            workingHours: {
              start: methodology.workingHoursStart,
              end: methodology.workingHoursEnd,
            },
          },
        })
        .subscribe({
          next: (project) => {
            this.isSubmitting.set(false);
            this.toastService.show('Project created successfully', 'success');
            this.router.navigate([
              '/organizations',
              this.currentOrg()?.slug,
              'projects',
              project.id,
            ]);
          },
          error: () => {
            this.isSubmitting.set(false);
            this.toastService.show('Failed to create project', 'error');
          },
        });
    }
  }
}
