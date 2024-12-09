import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map, Observable, of } from 'rxjs';
import { MockDataService } from './mock-data.service';
import { ProjectProgress } from '../../../shared/interfaces/dashboard.interface';

export interface DashboardMetrics {
  totalProjects: number;
  activeProjects: number;
  completedTasks: number;
  pendingTasks: number;
  teamVelocity: number;
  upcomingDeadlines: number;
}

export interface TeamActivity {
  date: Date;
  completedTasks: number;
  newTasks: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private metrics = signal<DashboardMetrics | null>(null);
  private projectProgress = signal<ProjectProgress[]>([]);
  private teamActivity = signal<TeamActivity[]>([]);

  constructor(private http: HttpClient, private mockData: MockDataService) {}

  getMetrics(): Observable<DashboardMetrics> {
    if (environment.useMockData) {
      return of(this.mockData.getDashboardMetrics()).pipe(
        map((metrics) => {
          this.metrics.set(metrics);
          return metrics;
        })
      );
    }

    return this.http
      .get<DashboardMetrics>(`${environment.apiUrl}/dashboard/metrics`)
      .pipe(
        map((metrics) => {
          this.metrics.set(metrics);
          return metrics;
        })
      );
  }

  getProjectProgress(): Observable<ProjectProgress[]> {
    if (environment.useMockData) {
      return of(this.mockData.getProjectProgress()).pipe(
        map((progress) => {
          this.projectProgress.set(progress);
          return progress;
        })
      );
    }

    return this.http
      .get<ProjectProgress[]>(
        `${environment.apiUrl}/dashboard/project-progress`
      )
      .pipe(
        map((progress) => {
          this.projectProgress.set(progress);
          return progress;
        })
      );
  }

  getTeamActivity(): Observable<TeamActivity[]> {
    if (environment.useMockData) {
      return of(this.mockData.getTeamActivity()).pipe(
        map((activity) => {
          this.teamActivity.set(activity);
          return activity;
        })
      );
    }

    return this.http
      .get<TeamActivity[]>(`${environment.apiUrl}/dashboard/team-activity`)
      .pipe(
        map((activity) => {
          this.teamActivity.set(activity);
          return activity;
        })
      );
  }

  metrics$ = this.metrics.asReadonly();
  projectProgress$ = this.projectProgress.asReadonly();
  teamActivity$ = this.teamActivity.asReadonly();
}
