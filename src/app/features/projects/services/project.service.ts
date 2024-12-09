import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  Project,
  ProjectMethodology,
} from '../../../shared/interfaces/project.interface';
import { ToastService } from '../../../core/services/toast.service';
import { Router } from '@angular/router';
import { map } from 'rxjs';

export interface CreateProjectDto {
  name: string;
  key: string;
  description?: string;
  methodology: ProjectMethodology;
  organizationId: string;
  settings: {
    estimationType: 'story_points' | 'hours';
    sprintDuration?: number;
    defaultColumns: string[];
    workingDays: string[];
    workingHours: {
      start: string;
      end: string;
    };
  };
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private toastService = inject(ToastService);

  // State
  private projects = signal<Project[]>([]);
  private currentProject = signal<Project | null>(null);

  // Computed
  readonly projectsList = this.projects.asReadonly();
  readonly currentProjectValue = this.currentProject.asReadonly();

  createProject(data: CreateProjectDto) {
    return this.http.post<Project>(`${environment.apiUrl}/projects`, data).pipe(
      map((project) => {
        this.projects.update((projects) => [...projects, project]);
        return project;
      })
    );
  }

  loadProjects(organizationId: string) {
    return this.http
      .get<Project[]>(
        `${environment.apiUrl}/organizations/${organizationId}/projects`
      )
      .pipe(
        map((projects) => {
          this.projects.set(projects);
          return projects;
        })
      );
  }

  setCurrentProject(projectId: string) {
    const project = this.projects().find((p) => p.id === projectId);
    if (project) {
      this.currentProject.set(project);
    }
  }
}
