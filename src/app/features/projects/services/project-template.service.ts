import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ProjectTemplate } from '../../../shared/interfaces/project-template.interface';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectTemplateService {
  private http = inject(HttpClient);

  // State
  private templates = signal<ProjectTemplate[]>([]);

  // Computed
  readonly templatesList = this.templates.asReadonly();

  loadTemplates() {
    return this.http
      .get<ProjectTemplate[]>(`${environment.apiUrl}/project-templates`)
      .pipe(
        map((templates) => {
          this.templates.set(templates);
          return templates;
        })
      );
  }

  getTemplateById(id: string) {
    return this.templates().find((t) => t.id === id);
  }

  // Mock data for development
  getMockTemplates(): ProjectTemplate[] {
    return [
      {
        id: 'scrum-software',
        name: 'Scrum Software Development',
        description:
          'Template for software development teams using Scrum methodology',
        methodology: 'scrum',
        icon: 'code',
        category: 'software',
        settings: {
          estimationType: 'story_points',
          defaultColumns: [
            'backlog',
            'todo',
            'in_progress',
            'in_review',
            'done',
          ],
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          workingHours: {
            start: '09:00',
            end: '17:00',
          },
        },
        boards: [
          {
            name: 'Sprint Board',
            type: 'scrum',
            columns: [
              { name: 'To Do', key: 'todo', order: 1, category: 'todo' },
              {
                name: 'In Progress',
                key: 'in_progress',
                order: 2,
                category: 'in_progress',
              },
              {
                name: 'In Review',
                key: 'in_review',
                order: 3,
                category: 'in_progress',
              },
              { name: 'Done', key: 'done', order: 4, category: 'done' },
            ],
          },
        ],
        epics: [
          {
            name: 'Project Setup',
            description: 'Initial project setup and configuration',
            stories: [
              {
                name: 'Repository Setup',
                description:
                  'Set up source control repository and initial structure',
                priority: 'high',
                points: 3,
                tasks: [
                  {
                    name: 'Create repository',
                    description: 'Create and configure Git repository',
                  },
                  {
                    name: 'Setup branch protection rules',
                    description:
                      'Configure branch protection and review requirements',
                  },
                ],
              },
              {
                name: 'Development Environment',
                description: 'Set up development environment and tools',
                priority: 'high',
                points: 5,
                tasks: [
                  {
                    name: 'Configure development tools',
                    description:
                      'Install and configure IDE and development tools',
                  },
                  {
                    name: 'Setup local environment',
                    description: 'Configure local development environment',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'kanban-marketing',
        name: 'Marketing Campaign',
        description: 'Template for managing marketing campaigns and content',
        methodology: 'kanban',
        icon: 'campaign',
        category: 'marketing',
        settings: {
          estimationType: 'hours',
          defaultColumns: [
            'backlog',
            'planning',
            'in_progress',
            'review',
            'published',
          ],
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          workingHours: {
            start: '09:00',
            end: '17:00',
          },
        },
        boards: [
          {
            name: 'Content Board',
            type: 'kanban',
            columns: [
              { name: 'Backlog', key: 'backlog', order: 1, category: 'todo' },
              { name: 'Planning', key: 'planning', order: 2, category: 'todo' },
              {
                name: 'In Progress',
                key: 'in_progress',
                order: 3,
                category: 'in_progress',
              },
              {
                name: 'Review',
                key: 'review',
                order: 4,
                category: 'in_progress',
              },
              {
                name: 'Published',
                key: 'published',
                order: 5,
                category: 'done',
              },
            ],
          },
        ],
        epics: [
          {
            name: 'Campaign Planning',
            description: 'Initial campaign planning and strategy',
            stories: [
              {
                name: 'Market Research',
                description: 'Conduct market and competitor research',
                priority: 'high',
                points: 5,
                tasks: [
                  {
                    name: 'Competitor Analysis',
                    description: 'Analyze competitor campaigns and strategies',
                    estimatedHours: 8,
                  },
                  {
                    name: 'Target Audience Research',
                    description: 'Define and research target audience segments',
                    estimatedHours: 6,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'scrum-product',
        name: 'Product Launch',
        description: 'Template for planning and executing product launches',
        methodology: 'scrum',
        icon: 'rocket_launch',
        category: 'business',
        settings: {
          estimationType: 'story_points',
          defaultColumns: [
            'backlog',
            'planning',
            'in_progress',
            'testing',
            'done',
          ],
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          workingHours: {
            start: '09:00',
            end: '17:00',
          },
        },
        boards: [
          {
            name: 'Launch Board',
            type: 'scrum',
            columns: [
              { name: 'Backlog', key: 'backlog', order: 1, category: 'todo' },
              { name: 'Planning', key: 'planning', order: 2, category: 'todo' },
              {
                name: 'In Progress',
                key: 'in_progress',
                order: 3,
                category: 'in_progress',
              },
              {
                name: 'Testing',
                key: 'testing',
                order: 4,
                category: 'in_progress',
              },
              { name: 'Done', key: 'done', order: 5, category: 'done' },
            ],
          },
        ],
        epics: [
          {
            name: 'Pre-launch Preparation',
            description: 'Tasks to prepare for product launch',
            stories: [
              {
                name: 'Market Analysis',
                description: 'Analyze market conditions and competition',
                priority: 'high',
                points: 8,
                tasks: [
                  {
                    name: 'Competitor Analysis',
                    description: 'Research competitor products and pricing',
                    estimatedHours: 16,
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  }

  async importTemplate(template: ProjectTemplate) {
    // Generate new IDs for the template and its components
    const newTemplate = {
      ...template,
      id: crypto.randomUUID(),
    };

    // Save to backend or local storage
    if (environment.useMockData) {
      this.templates.update((templates) => [...templates, newTemplate]);
      return newTemplate;
    }

    return this.http
      .post<ProjectTemplate>(
        `${environment.apiUrl}/project-templates`,
        newTemplate
      )
      .pipe(
        map((savedTemplate) => {
          this.templates.update((templates) => [...templates, savedTemplate]);
          return savedTemplate;
        })
      );
  }

  exportTemplate(templateId: string) {
    const template = this.templates().find((t) => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    return template;
  }

  setTemplates(templates: ProjectTemplate[]) {
    this.templates.set(templates);
  }
}
