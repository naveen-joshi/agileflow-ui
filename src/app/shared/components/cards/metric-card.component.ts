import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="metric-card">
      <div class="metric-content">
        <div class="metric-info">
          <span class="metric-label">{{ label }}</span>
          <h3 class="metric-value">{{ value }}</h3>
          <div
            class="metric-trend"
            [class.positive]="change > 0"
            [class.negative]="change < 0"
          >
            <mat-icon>{{
              change > 0 ? 'trending_up' : 'trending_down'
            }}</mat-icon>
            <span>{{ Math.abs(change) }}%</span>
          </div>
        </div>
        <mat-icon class="metric-icon">{{ icon }}</mat-icon>
      </div>
    </div>
  `,
  styles: [
    `
      .metric-card {
        background: rgb(var(--bg-primary));
        border-radius: var(--border-radius);
        padding: var(--spacing-lg);
        box-shadow: var(--shadow-sm);
        transition: var(--transition-base);
        border: 1px solid rgba(var(--text-primary), 0.1);

        &:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
      }

      .metric-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .metric-info {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
      }

      .metric-label {
        color: rgb(var(--text-secondary));
        font-size: 0.875rem;
      }

      .metric-value {
        font-size: 1.5rem;
        font-weight: 600;
        color: rgb(var(--text-primary));
        margin: 0;
      }

      .metric-trend {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        font-size: 0.875rem;

        &.positive {
          color: rgb(var(--color-success));
        }

        &.negative {
          color: rgb(var(--color-error));
        }

        mat-icon {
          font-size: 1rem;
          width: 1rem;
          height: 1rem;
        }
      }

      .metric-icon {
        color: rgb(var(--color-primary));
        opacity: 0.8;
      }
    `,
  ],
})
export class MetricCardComponent {
  @Input() label = '';
  @Input() value = 0;
  @Input() change = 0;
  @Input() icon = '';

  protected Math = Math;
}
