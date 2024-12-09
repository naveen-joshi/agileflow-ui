import { NavItem } from '../interfaces/main-layout.interface';

export const NAV_ITEMS: NavItem[] = [
  { path: '/app/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { path: '/app/projects', icon: 'folder', label: 'Projects' },
  { path: '/app/tasks', icon: 'task', label: 'Tasks' },
  { path: '/app/team', icon: 'people', label: 'Team' },
  { path: '/app/calendar', icon: 'calendar_today', label: 'Calendar' },
  { path: '/app/reports', icon: 'bar_chart', label: 'Reports' },
  { path: '/app/settings', icon: 'settings', label: 'Settings' },
];
