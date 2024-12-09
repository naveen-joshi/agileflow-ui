import { ProjectMethodology } from './project.interface';

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  methodology: ProjectMethodology;
  icon: string;
  category: 'software' | 'business' | 'marketing' | 'other';
  settings: {
    estimationType: 'story_points' | 'hours';
    defaultColumns: string[];
    workingDays: string[];
    workingHours: {
      start: string;
      end: string;
    };
  };
  boards: BoardTemplate[];
  epics: EpicTemplate[];
}

export interface BoardTemplate {
  name: string;
  type: 'scrum' | 'kanban';
  columns: {
    name: string;
    key: string;
    order: number;
    category: 'todo' | 'in_progress' | 'done';
  }[];
}

export interface EpicTemplate {
  name: string;
  description?: string;
  stories: StoryTemplate[];
}

export interface StoryTemplate {
  name: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  points?: number;
  tasks: {
    name: string;
    description?: string;
    estimatedHours?: number;
  }[];
}
