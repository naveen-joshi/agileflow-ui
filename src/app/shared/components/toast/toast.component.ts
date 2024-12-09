import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../../../core/services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div
      *ngIf="toasts().length"
      class="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    >
      @for (toast of toasts(); track toast.id) {
      <div
        @slideIn
        class="flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-white"
        [ngClass]="getToastClass(toast.type)"
      >
        <mat-icon>{{ getToastIcon(toast.type) }}</mat-icon>
        <span>{{ toast.message }}</span>
      </div>
      }
    </div>
  `,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate(
          '150ms ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '150ms ease-in',
          style({ transform: 'translateX(100%)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class ToastComponent {
  private toastService = inject(ToastService);
  protected toasts = this.toastService.getToasts();

  protected getToastClass(type: 'success' | 'error' | 'info'): string {
    switch (type) {
      case 'success':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-blue-600';
    }
  }

  protected getToastIcon(type: 'success' | 'error' | 'info'): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  }
}
