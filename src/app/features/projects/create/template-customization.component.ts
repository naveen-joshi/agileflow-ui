import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectTemplate } from '../../../shared/interfaces/project-template.interface';
import { TemplateCustomization } from '../../../shared/interfaces/template-customization.interface';
import { DialogRef } from '@ngneat/dialog';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-template-customization',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    NgSelectModule,
    DragDropModule,
  ],
  template: `
    <div class="w-[1000px]">
      <div class="flex items-start justify-between p-6 border-b">
        <div>
          <h2 class="text-xl font-semibold flex items-center gap-3">
            Customize Template
          </h2>
          <p class="mt-1 text-gray-600">
            Customize the template settings and content before creating your
            project
          </p>
        </div>
        <button mat-icon-button (click)="ref.close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-tab-group class="p-6">
        <!-- Basic Settings -->
        <mat-tab label="Basic Settings">
          <div class="py-4 space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Project Name</mat-label>
                <input
                  matInput
                  [(ngModel)]="customization.name"
                  placeholder="Enter project name"
                  required
                />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Project Key</mat-label>
                <input
                  matInput
                  [(ngModel)]="customization.key"
                  placeholder="Enter project key"
                  required
                  pattern="[A-Z]{2,10}"
                  oninput="this.value = this.value.toUpperCase()"
                />
                <mat-hint>2-10 uppercase letters</mat-hint>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Description</mat-label>
              <textarea
                matInput
                [(ngModel)]="customization.description"
                rows="3"
                placeholder="Enter project description"
              ></textarea>
            </mat-form-field>

            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Methodology
                </label>
                <ng-select
                  [(ngModel)]="customization.methodology"
                  [items]="methodologies"
                  bindLabel="name"
                  bindValue="value"
                  placeholder="Select methodology"
                >
                  <ng-template ng-option-tmp let-item="item">
                    <mat-icon class="align-middle mr-2">{{
                      item.value === 'scrum' ? 'refresh' : 'view_column'
                    }}</mat-icon>
                    {{ item.name }}
                  </ng-template>
                </ng-select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Estimation Type
                </label>
                <ng-select
                  [(ngModel)]="customization.settings.estimationType"
                  [items]="estimationTypes"
                  bindLabel="name"
                  bindValue="value"
                  placeholder="Select estimation type"
                >
                  <ng-template ng-option-tmp let-item="item">
                    <mat-icon class="align-middle mr-2">{{
                      item.value === 'story_points' ? 'stars' : 'schedule'
                    }}</mat-icon>
                    {{ item.name }}
                  </ng-template>
                </ng-select>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Board Columns -->
        <mat-tab label="Board Columns">
          <div class="py-4">
            <div
              cdkDropList
              (cdkDropListDropped)="dropColumn($event)"
              class="space-y-2"
            >
              @for (column of customization.settings.defaultColumns; track
              column.key) {
              <div
                cdkDrag
                class="p-4 bg-white rounded-lg border border-gray-200 flex items-center justify-between"
              >
                <div class="flex items-center gap-4">
                  <mat-checkbox
                    [(ngModel)]="column.enabled"
                    color="primary"
                  ></mat-checkbox>
                  <mat-icon cdkDragHandle class="cursor-move text-gray-400"
                    >drag_indicator</mat-icon
                  >
                  <div>
                    <input
                      [(ngModel)]="column.name"
                      class="text-lg font-medium bg-transparent border-none focus:outline-none"
                      [disabled]="!column.enabled"
                    />
                  </div>
                </div>
              </div>
              }
            </div>
          </div>
        </mat-tab>

        <!-- Epics & Stories -->
        <mat-tab label="Epics & Stories">
          <div class="py-4 space-y-6">
            @for (epic of customization.epics; track epic.id) {
            <div class="border rounded-lg">
              <div class="p-4 border-b bg-gray-50">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <mat-checkbox
                      [(ngModel)]="epic.enabled"
                      color="primary"
                    ></mat-checkbox>
                    <div>
                      <input
                        [(ngModel)]="epic.name"
                        class="text-lg font-medium bg-transparent border-none focus:outline-none"
                        [disabled]="!epic.enabled"
                      />
                    </div>
                  </div>
                </div>
                @if (epic.enabled) {
                <textarea
                  [(ngModel)]="epic.description"
                  class="mt-2 w-full p-2 rounded border"
                  rows="2"
                  placeholder="Epic description"
                ></textarea>
                }
              </div>

              @if (epic.enabled) {
              <div class="p-4 space-y-4">
                @for (story of epic.stories; track story.id) {
                <div class="border rounded p-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <mat-checkbox
                        [(ngModel)]="story.enabled"
                        color="primary"
                      ></mat-checkbox>
                      <input
                        [(ngModel)]="story.name"
                        class="font-medium bg-transparent border-none focus:outline-none"
                        [disabled]="!story.enabled"
                      />
                    </div>
                    @if (story.enabled) {
                    <div class="flex items-center gap-2">
                      <ng-select
                        [(ngModel)]="story.priority"
                        [items]="priorities"
                        bindLabel="name"
                        bindValue="value"
                        [clearable]="false"
                        class="w-32"
                      >
                      </ng-select>
                      @if (customization.settings.estimationType ===
                      'story_points') {
                      <input
                        type="number"
                        [(ngModel)]="story.points"
                        class="w-20 p-2 border rounded"
                        placeholder="Points"
                      />
                      }
                    </div>
                    }
                  </div>
                </div>
                }
              </div>
              }
            </div>
            }
          </div>
        </mat-tab>
      </mat-tab-group>

      <div class="flex justify-end gap-3 p-6 border-t">
        <button mat-stroked-button (click)="ref.close()">Cancel</button>
        <button
          mat-flat-button
          color="primary"
          (click)="ref.close(customization)"
          [disabled]="!isValid"
        >
          Create Project
        </button>
      </div>
    </div>
  `,
})
export class TemplateCustomizationComponent {
  template = input.required<ProjectTemplate>();
  ref = inject(DialogRef);

  // Form options
  methodologies = [
    { value: 'scrum', name: 'Scrum' },
    { value: 'kanban', name: 'Kanban' },
  ];

  estimationTypes = [
    { value: 'story_points', name: 'Story Points' },
    { value: 'hours', name: 'Hours' },
  ];

  priorities = [
    { value: 'low', name: 'Low' },
    { value: 'medium', name: 'Medium' },
    { value: 'high', name: 'High' },
  ];

  // Initialize customization from template
  customization: TemplateCustomization = this.initializeCustomization();

  private initializeCustomization(): TemplateCustomization {
    const template = this.template();
    return {
      name: '',
      key: '',
      description: '',
      methodology: template.methodology,
      settings: {
        estimationType: template.settings.estimationType,
        defaultColumns: template.boards[0].columns.map((col) => ({
          enabled: true,
          key: col.key,
          name: col.name,
          order: col.order,
        })),
        workingDays: [...template.settings.workingDays],
        workingHours: { ...template.settings.workingHours },
      },
      epics: template.epics.map((epic) => ({
        enabled: true,
        id: crypto.randomUUID(),
        name: epic.name,
        description: epic.description,
        stories: epic.stories.map((story) => ({
          enabled: true,
          id: crypto.randomUUID(),
          name: story.name,
          description: story.description,
          priority: story.priority,
          points: story.points,
          tasks: story.tasks.map((task) => ({
            enabled: true,
            id: crypto.randomUUID(),
            name: task.name,
            description: task.description,
            estimatedHours: task.estimatedHours,
          })),
        })),
      })),
    };
  }

  // Validation
  isValid = computed(() => {
    return (
      this.customization.name?.trim() &&
      /^[A-Z]{2,10}$/.test(this.customization.key) &&
      this.customization.settings.defaultColumns.some((col) => col.enabled)
    );
  });

  // Drag and drop
  dropColumn(event: CdkDragDrop<string[]>) {
    const columns = this.customization.settings.defaultColumns;
    const item = columns[event.previousIndex];
    columns.splice(event.previousIndex, 1);
    columns.splice(event.currentIndex, 0, item);
    columns.forEach((col, index) => (col.order = index + 1));
  }
}
