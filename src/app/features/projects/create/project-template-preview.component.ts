import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ProjectTemplate } from '../../../shared/interfaces/project-template.interface';
import { DialogRef } from '@ngneat/dialog';
import { TemplateCustomizationComponent } from './template-customization.component';
import { DialogService } from '@ngneat/dialog';

@Component({
  selector: 'app-project-template-preview',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
  ],
  template: `
    <div class="w-[800px]">
      <div class="flex items-start justify-between p-6 border-b">
        <div>
          <h2 class="text-xl font-semibold flex items-center gap-3">
            <mat-icon>{{ template().icon }}</mat-icon>
            {{ template().name }}
          </h2>
          <p class="mt-1 text-gray-600">{{ template().description }}</p>
        </div>
        <button mat-icon-button (click)="ref.close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-tab-group class="p-6">
        <!-- Overview -->
        <mat-tab label="Overview">
          <div class="py-4">
            <div class="grid grid-cols-2 gap-6">
              <div>
                <h3 class="font-medium mb-2">Methodology</h3>
                <div class="flex items-center gap-2 text-gray-600">
                  <mat-icon>
                    {{
                      template().methodology === 'scrum'
                        ? 'refresh'
                        : 'view_column'
                    }}
                  </mat-icon>
                  <span class="capitalize">{{ template().methodology }}</span>
                </div>
              </div>

              <div>
                <h3 class="font-medium mb-2">Estimation Type</h3>
                <div class="flex items-center gap-2 text-gray-600">
                  <mat-icon>
                    {{
                      template().settings.estimationType === 'story_points'
                        ? 'stars'
                        : 'schedule'
                    }}
                  </mat-icon>
                  <span class="capitalize">{{
                    template().settings.estimationType.replace('_', ' ')
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Boards -->
        <mat-tab label="Boards">
          <div class="py-4">
            @for (board of template().boards; track board.name) {
            <div class="mb-6 last:mb-0">
              <h3 class="font-medium mb-3">{{ board.name }}</h3>
              <div class="flex gap-4 overflow-x-auto pb-4">
                @for (column of board.columns; track column.key) {
                <div
                  class="flex-shrink-0 w-64 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <h4 class="font-medium mb-2">{{ column.name }}</h4>
                  <p class="text-sm text-gray-500">
                    Status: {{ column.category }}
                  </p>
                </div>
                }
              </div>
            </div>
            }
          </div>
        </mat-tab>

        <!-- Epics -->
        <mat-tab label="Epics">
          <div class="py-4">
            @for (epic of template().epics; track epic.name) {
            <div class="mb-6 last:mb-0">
              <h3 class="font-medium mb-2">{{ epic.name }}</h3>
              <p class="text-gray-600 mb-4">{{ epic.description }}</p>

              <div class="space-y-4">
                @for (story of epic.stories; track story.name) {
                <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-medium">{{ story.name }}</h4>
                    <div class="flex items-center gap-2">
                      <span
                        class="px-2 py-1 text-xs rounded"
                        [ngClass]="{
                          'bg-red-100 text-red-800': story.priority === 'high',
                          'bg-yellow-100 text-yellow-800':
                            story.priority === 'medium',
                          'bg-green-100 text-green-800':
                            story.priority === 'low'
                        }"
                      >
                        {{ story.priority }}
                      </span>
                      @if (story.points) {
                      <span
                        class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                      >
                        {{ story.points }} points
                      </span>
                      }
                    </div>
                  </div>
                  <p class="text-gray-600 text-sm mb-3">
                    {{ story.description }}
                  </p>

                  <div class="space-y-2">
                    @for (task of story.tasks; track task.name) {
                    <div
                      class="p-2 bg-white rounded border border-gray-200 text-sm"
                    >
                      <div class="flex items-center justify-between">
                        <span>{{ task.name }}</span>
                        @if (task.estimatedHours) {
                        <span class="text-gray-500">
                          {{ task.estimatedHours }}h
                        </span>
                        }
                      </div>
                    </div>
                    }
                  </div>
                </div>
                }
              </div>
            </div>
            }
          </div>
        </mat-tab>
      </mat-tab-group>

      <div class="flex justify-end gap-3 p-6 border-t">
        <button mat-stroked-button (click)="ref.close()">Cancel</button>
        <button mat-flat-button color="primary" (click)="ref.close(template())">
          Use Template
        </button>
      </div>
    </div>
  `,
})
export class ProjectTemplatePreviewComponent {
  template = input.required<ProjectTemplate>();
  ref = inject(DialogRef);
  dialogService = inject(DialogService);

  async useTemplate() {
    const dialogRef = this.dialogService.open(TemplateCustomizationComponent, {
      data: this.template(),
    });

    const result = await dialogRef.afterClosed$.toPromise();
    if (result) {
      this.ref.close(result);
    }
  }
}
