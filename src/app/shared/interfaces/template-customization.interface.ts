import { ProjectMethodology } from './project.interface';

export interface TemplateCustomization {
  name: string;
  key: string;
  description?: string;
  methodology: ProjectMethodology;
  settings: {
    estimationType: 'story_points' | 'hours';
    sprintDuration?: number;
    defaultColumns: {
      enabled: boolean;
      key: string;
      name: string;
      order: number;
    }[];
    workingDays: string[];
    workingHours: {
      start: string;
      end: string;
    };
  };
  epics: {
    enabled: boolean;
    id: string;
    name: string;
    description?: string;
    stories: {
      enabled: boolean;
      id: string;
      name: string;
      description?: string;
      priority: 'low' | 'medium' | 'high';
      points?: number;
      tasks: {
        enabled: boolean;
        id: string;
        name: string;
        description?: string;
        estimatedHours?: number;
      }[];
    }[];
  }[];
}
