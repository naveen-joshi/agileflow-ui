import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  Metric,
  ChartData,
  ProjectProgress,
  TeamMember,
} from './interfaces/dashboard.interface';
import {
  DASHBOARD_METRICS,
  PROJECT_PROGRESS,
  TEAM_MEMBERS,
} from './constants/dashboard-data';
import { MetricCardComponent } from '../../shared/components/cards/metric-card.component';
import { LineChartComponent } from '../../shared/components/charts/line-chart.component';
import { ProjectCardComponent } from '../../shared/components/cards/project-card.component';
import { TeamMemberCardComponent } from '../../shared/components/cards/team-member-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BarChartComponent } from '../../shared/components/charts/bar-chart/bar-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MetricCardComponent,
    ProjectCardComponent,
    TeamMemberCardComponent,
    BarChartComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  metrics = signal<Metric[]>(DASHBOARD_METRICS);
  projects = signal<ProjectProgress[]>(PROJECT_PROGRESS);
  teamMembers = signal<TeamMember[]>(TEAM_MEMBERS);

  teamVelocityData = signal<ChartData>({
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Story Points',
        data: [20, 25, 22, 30],
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
      },
    ],
  });

  taskCompletionData = signal<ChartData>({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [8, 12, 15, 10, 14],
        backgroundColor: '#10B981',
      },
    ],
  });

  getProgressColor(status: ProjectProgress['status']): string {
    const colors = {
      'on-track': 'var(--color-success)',
      'at-risk': 'var(--color-warning)',
      delayed: 'var(--color-error)',
    };
    return colors[status];
  }
}
