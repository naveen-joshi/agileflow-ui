import {
  Metric,
  ProjectProgress,
  TeamMember,
} from '../interfaces/dashboard.interface';

export const DASHBOARD_METRICS: Metric[] = [
  {
    label: 'Total Projects',
    value: 12,
    change: 2,
    icon: 'folder',
  },
  {
    label: 'Active Tasks',
    value: 48,
    change: -5,
    icon: 'task',
  },
  {
    label: 'Team Members',
    value: 24,
    change: 3,
    icon: 'people',
  },
  {
    label: 'Hours Logged',
    value: 164,
    change: 12,
    icon: 'schedule',
  },
];

export const PROJECT_PROGRESS: ProjectProgress[] = [
  {
    id: '1',
    name: 'Website Redesign',
    progress: 75,
    status: 'on-track',
  },
  {
    id: '2',
    name: 'Mobile App Development',
    progress: 45,
    status: 'at-risk',
  },
  {
    id: '3',
    name: 'Database Migration',
    progress: 30,
    status: 'delayed',
  },
  {
    id: '4',
    name: 'API Integration',
    progress: 90,
    status: 'on-track',
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Lead Developer',
    avatar: 'assets/avatars/john.jpg',
    tasksCompleted: 15,
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'UX Designer',
    avatar: 'assets/avatars/jane.jpg',
    tasksCompleted: 12,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    role: 'Backend Developer',
    avatar: 'assets/avatars/mike.jpg',
    tasksCompleted: 18,
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    role: 'Project Manager',
    avatar: 'assets/avatars/sarah.jpg',
    tasksCompleted: 8,
  },
];
