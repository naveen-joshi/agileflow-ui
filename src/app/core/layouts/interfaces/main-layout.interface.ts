export interface Notification {
  id: string;
  message: string;
  time: Date;
  read: boolean;
  icon: string;
}

export interface Breadcrumb {
  label: string;
  path: string;
}

export interface SearchResult {
  type: 'project' | 'task' | 'user';
  title: string;
  url: string;
}

export interface NavItem {
  path: string;
  icon: string;
  label: string;
}
