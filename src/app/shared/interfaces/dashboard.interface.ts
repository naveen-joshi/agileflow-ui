export interface ProjectProgress {
  id: string;
  name: string;
  progress: number;
  status: 'on_track' | 'at_risk' | 'delayed';
  startDate: Date;
  endDate: Date;
}
