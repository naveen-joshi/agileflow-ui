export interface Metric {
  label: string;
  value: number;
  change: number;
  icon: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }[];
}

export interface ProjectProgress {
  id: string;
  name: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'delayed';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  tasksCompleted: number;
}
