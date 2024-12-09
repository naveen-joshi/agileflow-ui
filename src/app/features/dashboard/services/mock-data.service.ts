import { Injectable } from '@angular/core';
import { DashboardMetrics, TeamActivity } from './dashboard.service';
import { ProjectProgress } from '../../../shared/interfaces/dashboard.interface';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  getDashboardMetrics(): DashboardMetrics {
    return {
      totalProjects: 24,
      activeProjects: 12,
      completedTasks: 156,
      pendingTasks: 43,
      teamVelocity: 85,
      upcomingDeadlines: 8,
    };
  }

  getProjectProgress(): ProjectProgress[] {
    return [
      {
        id: '1',
        name: 'E-commerce Platform',
        progress: 75,
        status: 'on_track',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31'),
      },
      {
        id: '2',
        name: 'Mobile App Development',
        progress: 45,
        status: 'at_risk',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-05-30'),
      },
      {
        id: '3',
        name: 'CRM Integration',
        progress: 90,
        status: 'on_track',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-02-28'),
      },
      {
        id: '4',
        name: 'Data Migration',
        progress: 30,
        status: 'delayed',
        startDate: new Date('2024-02-15'),
        endDate: new Date('2024-04-15'),
      },
    ];
  }

  getTeamActivity(): TeamActivity[] {
    const today = new Date();
    const data: TeamActivity[] = [];

    // Generate last 30 days of data
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Generate some random but realistic-looking data
      const completedTasks = Math.floor(Math.random() * 10) + 5; // 5-15 tasks
      const newTasks = Math.floor(Math.random() * 8) + 3; // 3-11 tasks

      data.push({
        date,
        completedTasks,
        newTasks,
      });
    }

    return data;
  }
}
