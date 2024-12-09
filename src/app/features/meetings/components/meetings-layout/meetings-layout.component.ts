import { Component, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkActive, RouterOutlet, RouterLink } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-meetings-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  template: `
    <div class="meetings-layout">
      <mat-drawer-container>
        <mat-drawer #sidenav mode="side" [opened]="!isMobile()" class="sidenav" [class.expanded]="sidenavExpanded()">
          <div class="sidenav-content">
            <div class="logo-section">
              <img src="assets/images/products/meetflow-icon.svg" alt="MeetFlow" class="h-8 w-8">
              <span class="logo-text" *ngIf="sidenavExpanded()">MeetFlow</span>
            </div>

            <div class="actions-section">
              <button mat-raised-button color="primary" routerLink="schedule" class="new-meeting-btn">
                <mat-icon>add</mat-icon>
                <span *ngIf="sidenavExpanded()">New Meeting</span>
              </button>
            </div>

            <mat-divider></mat-divider>

            <nav class="nav-section">
              <a
                mat-button
                routerLink=""
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                class="nav-item"
              >
                <mat-icon>calendar_today</mat-icon>
                <span *ngIf="sidenavExpanded()">Scheduled Meetings</span>
              </a>
              <a 
                mat-button 
                routerLink="recordings" 
                routerLinkActive="active"
                class="nav-item"
              >
                <mat-icon>video_library</mat-icon>
                <span *ngIf="sidenavExpanded()">Recordings</span>
              </a>
            </nav>
          </div>

          <button 
            mat-icon-button 
            class="toggle-btn"
            (click)="toggleSidenav()"
            [class.expanded]="sidenavExpanded()"
          >
            <mat-icon>chevron_left</mat-icon>
          </button>
        </mat-drawer>

        <mat-drawer-content>
          <div class="content-wrapper">
            <router-outlet />
          </div>
        </mat-drawer-content>
      </mat-drawer-container>
    </div>
  `,
  styles: [
    `
      .meetings-layout {
        height: 100vh;
        width: 100vw;
        background-color: var(--surface-ground);

        ::ng-deep .mat-drawer-container {
          height: 100%;
          background-color: var(--surface-ground);
        }

        ::ng-deep .mat-drawer {
          background-color: var(--surface-card);
          border-right: 1px solid var(--surface-border);
          transition: width 0.3s ease;
          width: 280px;

          &.expanded {
            width: 280px;
          }

          &:not(.expanded) {
            width: 72px;

            .nav-item {
              padding: 0 24px;
              justify-content: center;
            }

            .new-meeting-btn {
              min-width: unset;
              padding: 0 12px;
            }
          }
        }

        .sidenav-content {
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
        }

        .logo-section {
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;

          .logo-text {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-color);
          }
        }

        .actions-section {
          padding: 1rem;

          .new-meeting-btn {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
          }
        }

        .nav-section {
          padding: 1rem 0.5rem;

          .nav-item {
            width: 100%;
            justify-content: flex-start;
            gap: 0.75rem;
            height: 3rem;
            margin-bottom: 0.5rem;
            border-radius: 0.5rem;
            padding: 0 1rem;
            color: var(--text-color-secondary);

            mat-icon {
              color: var(--text-color-secondary);
            }

            &.active {
              background: var(--primary-color);
              color: var(--primary-color-text);

              mat-icon {
                color: var(--primary-color-text);
              }
            }

            &:hover:not(.active) {
              background-color: var(--surface-hover);
            }
          }
        }

        .toggle-btn {
          position: absolute;
          bottom: 1rem;
          right: -20px;
          z-index: 1;
          background-color: var(--surface-card);
          border: 1px solid var(--surface-border);
          border-radius: 50%;
          transform: rotate(0deg);
          transition: transform 0.3s ease;

          &.expanded {
            transform: rotate(180deg);
          }
        }

        .content-wrapper {
          padding: 2rem;
          height: 100%;
        }
      }
    `,
  ],
})
export class MeetingsLayoutComponent {
  @ViewChild('sidenav') sidenavRef!: MatSidenav;

  isMobile = signal(false);
  sidenavExpanded = signal(true);

  constructor(private breakpointObserver: BreakpointObserver) {
    // Watch for screen size changes
    this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .subscribe((result) => {
        this.isMobile.set(result.matches);
        if (result.matches) {
          this.sidenavRef?.close();
          this.sidenavExpanded.set(false);
        } else {
          this.sidenavRef?.open();
          this.sidenavExpanded.set(true);
        }
      });
  }

  toggleSidenav() {
    this.sidenavExpanded.update(value => !value);
  }
}
