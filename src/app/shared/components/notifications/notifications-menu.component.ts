import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { DropdownMenuComponent } from '../dropdown/dropdown-menu.component';

interface Notification {
  id: string;
  message: string;
  time: Date;
  read: boolean;
  icon: string;
}

@Component({
  selector: 'app-notifications-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    TimeAgoPipe,
    DropdownMenuComponent,
  ],
  template: `
    <app-dropdown-menu
      [(isOpen)]="isOpen"
      position="bottom-end"
      minWidth="320px"
      maxWidth="400px"
    >
      <button
        trigger
        mat-icon-button
        [matBadge]="unreadCount"
        [matBadgeHidden]="!unreadCount"
        matBadgeColor="warn"
        class="notification-trigger"
      >
        <mat-icon>notifications</mat-icon>
      </button>

      <div class="notifications-container">
        <div class="notifications-header">
          <h3 class="text-lg font-medium">Notifications</h3>
          @if (unreadCount) {
          <button
            class="text-sm text-primary-600 hover:text-primary-700"
            (click)="markAllAsRead.emit()"
          >
            Mark all as read
          </button>
          }
        </div>

        @if (notifications.length) {
        <div class="notifications-list">
          @for (notification of notifications; track notification.id) {
          <div
            class="notification-item"
            [class.unread]="!notification.read"
            (click)="onNotificationClick.emit(notification)"
          >
            <mat-icon [class.text-primary-500]="!notification.read">
              {{ notification.icon }}
            </mat-icon>
            <div class="notification-content">
              <p class="notification-message">{{ notification.message }}</p>
              <span class="notification-time">
                {{ notification.time | timeAgo }}
              </span>
            </div>
          </div>
          }
        </div>
        } @else {
        <div class="notifications-empty">
          <mat-icon class="text-gray-400">notifications_none</mat-icon>
          <p>No notifications</p>
        </div>
        }
      </div>
    </app-dropdown-menu>
  `,
  styles: [
    `
      .notifications-container {
        max-height: 480px;
        overflow-y: auto;
      }

      .notifications-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid rgba(var(--border-primary), 1);
        position: sticky;
        top: 0;
        background: rgb(var(--bg-primary));
        z-index: 1;

        h3 {
          color: rgb(var(--text-primary));
        }
      }

      .notifications-list {
        padding: 0.5rem 0;
      }

      .notification-item {
        display: flex;
        align-items: start;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        cursor: pointer;
        transition: all var(--transition-base);

        &:hover {
          background: rgb(var(--bg-tertiary));
        }

        &.unread {
          background: rgba(var(--color-primary), 0.1);
        }

        mat-icon {
          margin-top: 0.125rem;
          font-size: 1.25rem;
          width: 1.25rem;
          height: 1.25rem;
        }
      }

      .notification-content {
        flex: 1;
        min-width: 0;
      }

      .notification-message {
        margin: 0;
        color: rgb(var(--text-primary));
        font-size: 0.875rem;
        line-height: 1.25rem;
      }

      .notification-time {
        display: block;
        color: rgb(var(--text-secondary));
        font-size: 0.75rem;
        margin-top: 0.25rem;
      }

      .notifications-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
        color: rgb(var(--text-secondary));

        mat-icon {
          font-size: 2rem;
          width: 2rem;
          height: 2rem;
          margin-bottom: 0.5rem;
        }
      }
    `,
  ],
})
export class NotificationsMenuComponent {
  @Input() notifications: Notification[] = [];
  @Input() unreadCount = 0;
  @Output() markAllAsRead = new EventEmitter<void>();
  @Output() onNotificationClick = new EventEmitter<Notification>();

  isOpen = false;
}
