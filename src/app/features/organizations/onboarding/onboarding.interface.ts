export interface OrganizationBasicInfo {
  name: string;
  logo?: File;
  industry: string;
  size: string;
}

export interface OrganizationSettings {
  timezone: string;
  dateFormat: string;
  workingDays: string[];
  workingHours: {
    start: string;
    end: string;
  };
}

export interface ProjectSettings {
  methodology: 'scrum' | 'kanban';
  estimationType: 'story_points' | 'hours';
  sprintDuration: number;
  defaultColumns: string[];
}
