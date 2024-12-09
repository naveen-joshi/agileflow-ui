import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="project-card">
      <div class="project-header">
        <h3 class="project-name">{{ name }}</h3>
        <span class="project-status" [style.backgroundColor]="progressColor">
          {{ status }}
        </span>
      </div>
      <div class="progress-container">
        <div class="progress-info">
          <span>Progress</span>
          <span>{{ progress }}%</span>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            [style.width.%]="progress"
            [style.backgroundColor]="progressColor"
          ></div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .project-card {
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

      .project-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-md);
      }

      .project-name {
        font-size: 1rem;
        font-weight: 500;
        color: rgb(var(--text-primary));
        margin: 0;
      }

      .project-status {
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.75rem;
        font-weight: 500;
        color: white;
        text-transform: capitalize;
      }

      .progress-container {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
      }

      .progress-info {
        display: flex;
        justify-content: space-between;
        font-size: 0.875rem;
        color: rgb(var(--text-secondary));
      }

      .progress-bar {
        height: 0.5rem;
        background: rgba(var(--text-primary), 0.1);
        border-radius: 0.25rem;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        transition: width 0.3s ease;
      }
    `,
  ],
})
export class ProjectCardComponent {
  @Input() name = '';
  @Input() progress = 0;
  @Input() status: 'on-track' | 'at-risk' | 'delayed' = 'on-track';
  @Input() progressColor = '';
}
