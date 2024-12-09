export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'cancelled';
export type ProjectMethodology = 'scrum' | 'kanban';

export interface Project {
  id: string;
  name: string;
  key: string;
  description?: string;
  methodology: ProjectMethodology;
  status: ProjectStatus;
  organizationId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Epic {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  status: 'to_do' | 'in_progress' | 'done';
  startDate?: Date;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Story {
  id: string;
  epicId?: string;
  projectId: string;
  name: string;
  description?: string;
  status: 'backlog' | 'ready' | 'in_progress' | 'in_review' | 'done';
  priority: 'low' | 'medium' | 'high';
  points?: number;
  assigneeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  storyId: string;
  name: string;
  description?: string;
  status: 'to_do' | 'in_progress' | 'done';
  assigneeId?: string;
  estimatedHours?: number;
  createdAt: Date;
  updatedAt: Date;
}
