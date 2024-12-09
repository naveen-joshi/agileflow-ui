import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
  ],
  template: `
    <div class="flex flex-col h-full">
      <div class="flex items-center gap-3 px-2 py-4">
        <img src="assets/logo.svg" alt="Agileflow" class="h-8 w-8" />
        <span class="text-xl font-semibold">Agileflow</span>
      </div>

      <mat-nav-list class="flex-1">
        <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
          <mat-icon matListItemIcon>dashboard</mat-icon>
          <span matListItemTitle>Dashboard</span>
        </a>

        <a mat-list-item routerLink="/projects" routerLinkActive="active">
          <mat-icon matListItemIcon>folder</mat-icon>
          <span matListItemTitle>Projects</span>
        </a>

        <a mat-list-item routerLink="/reports" routerLinkActive="active">
          <mat-icon matListItemIcon>analytics</mat-icon>
          <span matListItemTitle>Reports</span>
        </a>
      </mat-nav-list>

      <mat-nav-list>
        <a mat-list-item routerLink="/profile" routerLinkActive="active">
          <mat-icon matListItemIcon>person</mat-icon>
          <span matListItemTitle>Profile</span>
        </a>

        <a mat-list-item (click)="authService.logout()">
          <mat-icon matListItemIcon>logout</mat-icon>
          <span matListItemTitle>Logout</span>
        </a>
      </mat-nav-list>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .active {
        background-color: rgb(var(--primary-color) / 0.1);
        color: rgb(var(--primary-color));
      }
    `,
  ],
})
export class MainNavComponent {
  protected authService = inject(AuthService);
}
