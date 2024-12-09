import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { DialogRef } from '@ngneat/dialog';
import { ProjectTemplate } from '../../../shared/interfaces/project-template.interface';
import { TemplateExportService } from '../services/template-export.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-template-import-export',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
  ],
  template: `
    <div class="w-[600px]">
      <div class="flex items-start justify-between p-6 border-b">
        <div>
          <h2 class="text-xl font-semibold">Import/Export Templates</h2>
          <p class="mt-1 text-gray-600">
            Import templates from file or export existing templates
          </p>
        </div>
        <button mat-icon-button (click)="ref.close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-tab-group class="p-6">
        <!-- Import -->
        <mat-tab label="Import Template">
          <div class="py-4">
            <div
              class="border-2 border-dashed rounded-lg p-8 text-center"
              [class.border-primary-500]="isDragging()"
              (dragover)="onDragOver($event)"
              (dragleave)="isDragging.set(false)"
              (drop)="onDrop($event)"
            >
              <div class="flex flex-col items-center">
                <mat-icon class="text-4xl mb-4 text-gray-400">
                  upload_file
                </mat-icon>
                <p class="mb-4">
                  Drag and drop your template file here, or
                  <button
                    mat-stroked-button
                    color="primary"
                    (click)="fileInput.click()"
                  >
                    Browse
                  </button>
                </p>
                <input
                  #fileInput
                  type="file"
                  class="hidden"
                  accept=".json"
                  (change)="onFileSelected($event)"
                />
                <p class="text-sm text-gray-500">
                  Only .json template files are supported
                </p>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Export -->
        <mat-tab label="Export Template">
          <div class="py-4">
            @if (selectedTemplate()) {
            <div class="mb-6">
              <h3 class="font-medium mb-2">Selected Template</h3>
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3">
                  <mat-icon>{{ selectedTemplate()?.icon }}</mat-icon>
                  <div>
                    <h4 class="font-medium">{{ selectedTemplate()?.name }}</h4>
                    <p class="text-sm text-gray-600">
                      {{ selectedTemplate()?.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            }

            <button
              mat-flat-button
              color="primary"
              [disabled]="!selectedTemplate()"
              (click)="exportTemplate()"
            >
              <mat-icon class="mr-2">download</mat-icon>
              Export Template
            </button>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
})
export class TemplateImportExportComponent {
  private exportService = inject(TemplateExportService);
  private toastService = inject(ToastService);
  ref = inject(DialogRef);

  isDragging = signal(false);
  selectedTemplate = signal<ProjectTemplate | null>(null);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  async onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);

    const file = event.dataTransfer?.files[0];
    if (file) {
      await this.importTemplate(file);
    }
  }

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      await this.importTemplate(file);
    }
  }

  private async importTemplate(file: File) {
    try {
      const template = await this.exportService.importTemplate(file);
      this.selectedTemplate.set(template);
      this.toastService.show('Template imported successfully', 'success');
    } catch (error) {
      this.toastService.show(
        'Failed to import template. Please check the file format.',
        'error'
      );
    }
  }

  exportTemplate() {
    const template = this.selectedTemplate();
    if (template) {
      this.exportService.exportTemplate(template);
      this.toastService.show('Template exported successfully', 'success');
    }
  }
}
