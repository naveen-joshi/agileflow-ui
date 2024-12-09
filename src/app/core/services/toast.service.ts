import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts = signal<Toast[]>([]);

  show(message: string, type: Toast['type'] = 'info') {
    const id = crypto.randomUUID();

    this.toasts.update((toasts) => [...toasts, { id, message, type }]);

    setTimeout(() => {
      this.toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
    }, 3000);
  }

  getToasts() {
    return this.toasts;
  }
}
