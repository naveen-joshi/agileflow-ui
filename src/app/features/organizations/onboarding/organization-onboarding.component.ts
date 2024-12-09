import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Router } from '@angular/router';
import { InputComponent } from 'src/app/shared/components/forms/input.component';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { CreateOrganizationDto } from 'src/app/shared/interfaces/organization.interface';

@Component({
  selector: 'app-organization-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    NgSelectModule,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './organization-onboarding.component.html',
  styleUrls: ['./organization-onboarding.component.scss'],
})
export class OrganizationOnboardingComponent {
  private fb = inject(FormBuilder);
  private organizationService = inject(OrganizationService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  logoPreview = signal<string | null>(null);
  isSubmitting = signal(false);

  basicInfoForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    industry: ['', Validators.required],
    size: ['', Validators.required],
    logo: [null as File | null],
  });

  settingsForm = this.fb.nonNullable.group({
    timezone: ['', Validators.required],
    dateFormat: ['', Validators.required],
    workingDays: [[] as string[], [Validators.required, Validators.minLength(1)]],
    workingHoursStart: ['09:00', Validators.required],
    workingHoursEnd: ['17:00', Validators.required],
  });

  projectSettingsForm = this.fb.nonNullable.group({
    methodology: ['scrum', Validators.required],
    estimationType: ['story_points', Validators.required],
    sprintDuration: [2, Validators.required],
    defaultColumns: [[] as string[], [Validators.required, Validators.minLength(1)]],
  });

  industries = [
    { id: 'tech', name: 'Technology' },
    { id: 'finance', name: 'Finance' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'education', name: 'Education' },
    { id: 'other', name: 'Other' },
  ];

  organizationSizes = [
    { id: '1-10', name: '1-10 employees' },
    { id: '11-50', name: '11-50 employees' },
    { id: '51-200', name: '51-200 employees' },
    { id: '201-500', name: '201-500 employees' },
    { id: '501+', name: '501+ employees' },
  ];

  timezones = [
    { value: 'UTC', name: 'UTC' },
    { value: 'America/New_York', name: 'Eastern Time' },
    { value: 'America/Chicago', name: 'Central Time' },
    { value: 'America/Denver', name: 'Mountain Time' },
    { value: 'America/Los_Angeles', name: 'Pacific Time' },
  ];

  dateFormats = [
    { value: 'MM/DD/YYYY', name: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', name: 'DD/MM/YYYY' },
    { value: 'YYYY-MM-DD', name: 'YYYY-MM-DD' },
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

  onLogoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.basicInfoForm.patchValue({ logo: file });
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  allFormsValid(): boolean {
    return (
      this.basicInfoForm.valid &&
      this.settingsForm.valid &&
      this.projectSettingsForm.valid
    );
  }

  next(event: Event, stepper: MatStepper) {
    const currentStepIndex = stepper.selectedIndex;
    
    switch (currentStepIndex) {
      case 0: // Basic Info Step
        if (this.basicInfoForm.valid) {
          stepper.next();
        }
        break;
      case 1: // Settings Step
        if (this.settingsForm.valid) {
          stepper.next();
        }
        break;
      case 2: // Project Settings Step
        if (this.projectSettingsForm.valid) {
          stepper.next();
        }
        break;
    }
  }

  onSubmit() {
    if (this.allFormsValid()) {
      this.isSubmitting.set(true);

      const basicInfo = this.basicInfoForm.getRawValue();
      const settings = this.settingsForm.getRawValue();
      const projectSettings = this.projectSettingsForm.getRawValue();

      const organizationData: CreateOrganizationDto = {
        name: basicInfo.name,
        logo: basicInfo.logo
      };

      const fullOrganizationData = {
        ...organizationData,
        industry: basicInfo.industry,
        size: basicInfo.size,
        settings: {
          ...settings,
          workingHours: {
            start: settings.workingHoursStart,
            end: settings.workingHoursEnd,
          },
        },
        projectSettings: {
          ...projectSettings,
          workingDays: settings.workingDays,
          workingHours: {
            start: settings.workingHoursStart,
            end: settings.workingHoursEnd,
          }
        }
      };

      this.organizationService
        .createOrganization(organizationData)
        .subscribe({
          next: (createdOrg) => {
            // Send additional data in a separate request or use a more complex DTO
            this.toastService.show(
              'Organization created successfully',
              'success'
            );
            this.router.navigate(['/organizations']);
          },
          error: (error) => {
            this.isSubmitting.set(false);
            this.toastService.show(
              'Failed to create organization',
              'error'
            );
          },
        });
    }
  }
}
