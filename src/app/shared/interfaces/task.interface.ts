export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigneeId?: string;
  projectId: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  status: Task['status'];
  priority: Task['priority'];
  assigneeId?: string;
  projectId: string;
  dueDate?: Date;
}
