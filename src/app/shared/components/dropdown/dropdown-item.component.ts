import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dropdown-item',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <div
      class="dropdown-item"
      [class.divider]="divider"
      [routerLink]="link"
      [class.active]="active"
      (click)="onClick($event)"
    >
      @if (icon) {
      <mat-icon class="item-icon">{{ icon }}</mat-icon>
      }
      <span class="item-content">
        <ng-content></ng-content>
      </span>
    </div>
  `,
  styles: [
    `
      .dropdown-item {
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
        color: rgb(var(--text-primary));
        transition: all var(--transition-base);
        cursor: pointer;
        gap: 0.75rem;

        &:hover {
          background: rgba(var(--text-primary), 0.05);
        }

        &.active {
          background: rgba(var(--color-primary), 0.1);
          color: rgb(var(--color-primary));
        }

        &.divider {
          border-top: 1px solid rgba(var(--text-primary), 0.1);
        }
      }

      .item-icon {
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
        opacity: 0.8;
      }

      .item-content {
        flex: 1;
      }
    `,
  ],
})
export class DropdownItemComponent {
  @Input() icon?: string;
  @Input() link?: string;
  @Input() active = false;
  @Input() divider = false;

  onClick(event: MouseEvent) {
    event.stopPropagation();
  }
}
