import { Injectable } from '@angular/core';
import { ProjectTemplate } from '../../../shared/interfaces/project-template.interface';

@Injectable({ providedIn: 'root' })
export class TemplateExportService {
  exportTemplate(template: ProjectTemplate) {
    const templateJson = JSON.stringify(template, null, 2);
    const blob = new Blob([templateJson], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `template-${template.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  async importTemplate(file: File): Promise<ProjectTemplate> {
    try {
      const content = await file.text();
      const template = JSON.parse(content) as ProjectTemplate;

      // Validate template structure
      if (!this.isValidTemplate(template)) {
        throw new Error('Invalid template format');
      }

      return template;
    } catch (error) {
      throw new Error('Failed to import template');
    }
  }

  private isValidTemplate(template: any): template is ProjectTemplate {
    return (
      template &&
      typeof template.id === 'string' &&
      typeof template.name === 'string' &&
      typeof template.description === 'string' &&
      (template.methodology === 'scrum' || template.methodology === 'kanban') &&
      typeof template.icon === 'string' &&
      Array.isArray(template.boards) &&
      Array.isArray(template.epics) &&
      template.settings &&
      Array.isArray(template.settings.defaultColumns) &&
      Array.isArray(template.settings.workingDays) &&
      template.settings.workingHours &&
      typeof template.settings.workingHours.start === 'string' &&
      typeof template.settings.workingHours.end === 'string'
    );
  }
}
