import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProjectTemplateService } from '../services/project-template.service';
import { Router } from '@angular/router';
import { ProjectTemplatePreviewComponent } from './project-template-preview.component';
import { DialogService } from '@ngneat/dialog';
import { ProjectTemplate } from '../../../shared/interfaces/project-template.interface';
import { TemplateImportExportComponent } from '../templates/template-import-export.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-project-template-selector',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              Choose Project Template
            </h1>
            <p class="mt-2 text-gray-600">
              Select a template to get started with predefined settings and
              workflows
            </p>
          </div>
          <button
            mat-stroked-button
            color="primary"
            (click)="openImportExport()"
          >
            <mat-icon>import_export</mat-icon>
            Import/Export
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Empty Template -->
          <mat-card
            class="hover:shadow-lg transition-shadow cursor-pointer"
            (click)="onSelectTemplate(null)"
          >
            <mat-card-content class="p-6">
              <div class="flex flex-col items-center text-center">
                <mat-icon class="text-4xl mb-4 text-primary-500">
                  add_circle_outline
                </mat-icon>
                <h2 class="text-xl font-semibold mb-2">Empty Project</h2>
                <p class="text-gray-600 mb-4">
                  Start with a blank project and customize everything
                </p>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Template Cards -->
          @for (template of templates(); track template.id) {
          <mat-card
            class="hover:shadow-lg transition-shadow cursor-pointer"
            (click)="onSelectTemplate(template)"
          >
            <mat-card-content class="p-6">
              <div class="flex flex-col items-center text-center">
                <mat-icon class="text-4xl mb-4 text-primary-500">
                  {{ template.icon }}
                </mat-icon>
                <h2 class="text-xl font-semibold mb-2">{{ template.name }}</h2>
                <p class="text-gray-600 mb-4">
                  {{ template.description }}
                </p>
                <div class="flex items-center gap-2 text-sm text-gray-500">
                  <mat-icon class="text-base">
                    {{ getMethodologyIcon(template.methodology) }}
                  </mat-icon>
                  <span class="capitalize">{{ template.methodology }}</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
          }
        </div>
      </div>
    </div>
  `,
})
export class ProjectTemplateSelectorComponent implements OnInit {
  private templateService = inject(ProjectTemplateService);
  private dialogService = inject(DialogService);
  private router = inject(Router);

  templates = computed(() => this.templateService.templatesList());

  ngOnInit() {
    // Load templates on component init
    if (environment.useMockData) {
      this.templateService.setTemplates(
        this.templateService.getMockTemplates()
      );
    } else {
      this.templateService.loadTemplates().subscribe();
    }
  }

  getMethodologyIcon(methodology: string): string {
    return methodology === 'scrum' ? 'refresh' : 'view_column';
  }

  async onSelectTemplate(template: ProjectTemplate | null) {
    if (template) {
      const dialogRef = this.dialogService.open(
        ProjectTemplatePreviewComponent,
        {
          data: template,
        }
      );

      const result = await dialogRef.afterClosed$.toPromise();
      if (result) {
        this.router.navigate(['/projects/new'], {
          queryParams: { template: result.id },
        });
      }
    } else {
      this.router.navigate(['/projects/new']);
    }
  }

  openImportExport() {
    const dialogRef = this.dialogService.open(TemplateImportExportComponent);
    dialogRef.afterClosed$.subscribe((template) => {
      if (template) {
        this.templateService.importTemplate(template);
      }
    });
  }
}
