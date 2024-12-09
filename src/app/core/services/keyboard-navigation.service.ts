import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';
import { KeyboardShortcutsDialogComponent } from '@shared/components/keyboard-shortcuts/keyboard-shortcuts-dialog.component';

@Injectable({ providedIn: 'root' })
export class KeyboardNavigationService {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  private shortcuts = new Map<string, () => void>([
    ['g d', () => this.router.navigate(['/dashboard'])],
    ['g p', () => this.router.navigate(['/projects'])],
    ['g t', () => this.router.navigate(['/tasks'])],
    ['g m', () => this.router.navigate(['/team'])],
    ['g s', () => this.router.navigate(['/settings'])],
    [
      '/',
      () => document.querySelector<HTMLElement>('app-search input')?.focus(),
    ],
    ['?', () => this.showShortcutsDialog()],
    ['esc', () => this.handleEscape()],
  ]);

  private keyBuffer = '';
  private keyTimeout: any;

  initialize() {
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  destroy() {
    document.removeEventListener('keydown', this.handleKeydown.bind(this));
  }

  private handleKeydown(event: KeyboardEvent) {
    // Ignore if typing in input or textarea
    if (this.isTypingInInput(event)) return;

    const key = this.getKeyFromEvent(event);

    if (key) {
      clearTimeout(this.keyTimeout);
      this.keyBuffer += key + ' ';

      this.keyTimeout = setTimeout(() => {
        this.keyBuffer = '';
      }, 1000);

      const command = this.keyBuffer.trim();
      const action = this.shortcuts.get(command);

      if (action) {
        event.preventDefault();
        action();
        this.keyBuffer = '';
      }
    }
  }

  private getKeyFromEvent(event: KeyboardEvent): string | null {
    if (event.key === 'Escape') return 'esc';
    if (event.key === '/') return '/';
    if (event.key === '?') return '?';
    if (event.key.match(/^[a-z]$/i)) return event.key.toLowerCase();
    return null;
  }

  private isTypingInInput(event: KeyboardEvent): boolean {
    const target = event.target as HTMLElement;
    return (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    );
  }

  private handleEscape() {
    // Close any open dialogs
    if (this.dialog.openDialogs.length) {
      this.dialog.closeAll();
      return;
    }

    // Clear any active search
    const searchInput =
      document.querySelector<HTMLInputElement>('app-search input');
    if (searchInput === document.activeElement) {
      searchInput?.blur();
      return;
    }
  }

  private showShortcutsDialog() {
    // Implement a dialog showing all available shortcuts
    this.dialog.open(KeyboardShortcutsDialogComponent);
  }
}
