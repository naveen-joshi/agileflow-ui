import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DropdownService {
  private activeDropdownId = new BehaviorSubject<string | null>(null);
  activeDropdown$ = this.activeDropdownId.asObservable();

  constructor() {
    // Close all dropdowns when clicking outside
    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        this.closeAll();
      }
    });
  }

  setActiveDropdown(id: string | null) {
    if (this.activeDropdownId.value !== id) {
      this.activeDropdownId.next(id);
    }
  }

  closeAll() {
    this.activeDropdownId.next(null);
  }
}
