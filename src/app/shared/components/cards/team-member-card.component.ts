import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-team-member-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="team-member-card">
      <div class="member-info">
        <img [src]="avatar" [alt]="name" class="member-avatar" />
        <div class="member-details">
          <h3 class="member-name">{{ name }}</h3>
          <span class="member-role">{{ role }}</span>
        </div>
      </div>
      <div class="member-stats">
        <div class="stats-item">
          <mat-icon class="stats-icon">task_alt</mat-icon>
          <div class="stats-info">
            <span class="stats-label">Tasks Completed</span>
            <span class="stats-value">{{ tasksCompleted }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .team-member-card {
        background: rgb(var(--bg-primary));
        border-radius: var(--border-radius);
        padding: var(--spacing-lg);
        box-shadow: var(--shadow-sm);
        border: 1px solid rgba(var(--text-primary), 0.1);
        transition: var(--transition-base);

        &:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
      }

      .member-info {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-md);
      }

      .member-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid rgb(var(--color-primary));
      }

      .member-details {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
      }

      .member-name {
        font-size: 1rem;
        font-weight: 500;
        color: rgb(var(--text-primary));
        margin: 0;
      }

      .member-role {
        font-size: 0.875rem;
        color: rgb(var(--text-secondary));
      }

      .member-stats {
        padding-top: var(--spacing-md);
        border-top: 1px solid rgba(var(--text-primary), 0.1);
      }

      .stats-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      .stats-icon {
        color: rgb(var(--color-primary));
        opacity: 0.8;
      }

      .stats-info {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
      }

      .stats-label {
        font-size: 0.75rem;
        color: rgb(var(--text-secondary));
      }

      .stats-value {
        font-size: 1rem;
        font-weight: 500;
        color: rgb(var(--text-primary));
      }

      @media (max-width: 768px) {
        .member-info {
          flex-direction: column;
          text-align: center;
        }

        .member-avatar {
          width: 64px;
          height: 64px;
        }

        .stats-item {
          justify-content: center;
        }
      }
    `,
  ],
})
export class TeamMemberCardComponent {
  @Input() name = '';
  @Input() role = '';
  @Input() avatar = '';
  @Input() tasksCompleted = 0;
}
