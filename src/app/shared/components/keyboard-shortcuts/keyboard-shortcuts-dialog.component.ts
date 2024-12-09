import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-keyboard-shortcuts-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">Keyboard Shortcuts</h2>

      <div class="grid gap-6">
        <section>
          <h3 class="text-lg font-medium mb-2">Navigation</h3>
          <div class="grid gap-2">
            <div class="flex items-center justify-between">
              <span>Go to Dashboard</span>
              <kbd>g d</kbd>
            </div>
            <div class="flex items-center justify-between">
              <span>Go to Projects</span>
              <kbd>g p</kbd>
            </div>
            <div class="flex items-center justify-between">
              <span>Go to Tasks</span>
              <kbd>g t</kbd>
            </div>
            <div class="flex items-center justify-between">
              <span>Go to Team</span>
              <kbd>g m</kbd>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-lg font-medium mb-2">Actions</h3>
          <div class="grid gap-2">
            <div class="flex items-center justify-between">
              <span>Focus Search</span>
              <kbd>/</kbd>
            </div>
            <div class="flex items-center justify-between">
              <span>Show Shortcuts</span>
              <kbd>?</kbd>
            </div>
            <div class="flex items-center justify-between">
              <span>Close/Cancel</span>
              <kbd>esc</kbd>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      kbd {
        padding: 0.2em 0.4em;
        font-size: 0.85em;
        font-family: ui-monospace, monospace;
        background: rgb(var(--bg-secondary));
        border: 1px solid rgba(var(--text-primary), 0.2);
        border-radius: var(--border-radius);
        box-shadow: 0 1px 1px rgba(var(--text-primary), 0.1);
      }
    `,
  ],
})
export class KeyboardShortcutsDialogComponent {}
