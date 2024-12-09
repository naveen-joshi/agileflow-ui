import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { DropdownService } from '../../services/dropdown.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

type DropdownPosition = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  template: `
    <div
      class="dropdown-container"
      [class.open]="isOpen"
      (clickOutside)="close()"
    >
      <div class="dropdown-trigger" (click)="toggle($event)">
        <ng-content select="[trigger]"></ng-content>
      </div>

      @if (isOpen) {
      <div
        #dropdownMenu
        class="dropdown-menu"
        [@slideIn]="'in'"
        [class.position-top]="position.startsWith('top')"
        [class.position-bottom]="position.startsWith('bottom')"
        [class.position-start]="position.endsWith('start')"
        [class.position-end]="position.endsWith('end')"
        [style.min-width]="minWidth"
        [style.max-width]="maxWidth"
      >
        <ng-content></ng-content>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .dropdown-container {
        position: relative;
        display: inline-block;
      }

      .dropdown-trigger {
        cursor: pointer;
      }

      .dropdown-menu {
        position: absolute;
        background: rgb(var(--bg-primary));
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        border: 1px solid rgba(var(--text-primary), 0.1);
        z-index: 1000;
        overflow: hidden;

        // Position variants
        &.position-bottom {
          top: calc(100% + 0.5rem);
          &.position-start {
            left: 0;
          }
          &.position-end {
            right: 0;
          }
        }

        &.position-top {
          bottom: calc(100% + 0.5rem);
          &.position-start {
            left: 0;
          }
          &.position-end {
            right: 0;
          }
        }

        .user-info {
          padding: 1rem;
          border-bottom: 1px solid rgba(var(--border-primary), 1);

          .name {
            color: rgb(var(--text-primary));
            font-weight: 500;
          }

          .email {
            color: rgb(var(--text-secondary));
            font-size: 0.875rem;
          }
        }
      }

      :host-context(.dark) {
        .dropdown-menu {
          background: rgb(var(--bg-secondary));
          border-color: rgba(var(--text-primary), 0.2);
        }
      }
    `,
  ],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({
          transform: '{{transform}}',
          opacity: 0,
        }),
        animate(
          '150ms ease-out',
          style({
            transform: 'translate(0, 0)',
            opacity: 1,
          })
        ),
      ]),
      transition(':leave', [
        animate(
          '150ms ease-in',
          style({
            transform: '{{transform}}',
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class DropdownMenuComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;

  @Input() position: DropdownPosition = 'bottom-start';
  @Input() minWidth = '200px';
  @Input() maxWidth = 'none';
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Input() id!: string;
  private destroy$ = new Subject<void>();

  constructor(
    private elementRef: ElementRef,
    private dropdownService: DropdownService
  ) {}

  ngOnInit() {
    this.dropdownService.activeDropdown$
      .pipe(takeUntil(this.destroy$))
      .subscribe((activeId) => {
        if (activeId !== this.id && this.isOpen) {
          this.close();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    if (this.isOpen) {
      this.updatePosition();
    }
  }

  toggle(event: MouseEvent) {
    event.stopPropagation();
    if (!this.isOpen) {
      this.dropdownService.setActiveDropdown(this.id);
    } else {
      this.dropdownService.setActiveDropdown(null);
    }
    this.isOpen = !this.isOpen;
    this.isOpenChange.emit(this.isOpen);
    if (this.isOpen) {
      setTimeout(() => this.updatePosition());
    }
  }

  close() {
    if (this.isOpen) {
      this.isOpen = false;
      this.isOpenChange.emit(false);
      this.dropdownService.setActiveDropdown(null);
    }
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  onWindowChange() {
    if (this.isOpen) {
      this.updatePosition();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress() {
    this.close();
  }

  private updatePosition() {
    if (!this.dropdownMenu) return;

    const trigger =
      this.elementRef.nativeElement.querySelector('.dropdown-trigger');
    const menu = this.dropdownMenu.nativeElement;
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const triggerRect = trigger.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();

    // Check if menu goes beyond viewport
    const exceedsRight = triggerRect.left + menuRect.width > viewport.width;
    const exceedsBottom =
      triggerRect.bottom + menuRect.height > viewport.height;

    // Update position based on viewport constraints
    if (exceedsBottom && triggerRect.top > menuRect.height) {
      this.position = this.position.replace(
        'bottom',
        'top'
      ) as DropdownPosition;
    } else {
      this.position = this.position.replace(
        'top',
        'bottom'
      ) as DropdownPosition;
    }

    if (exceedsRight) {
      this.position = this.position.replace('start', 'end') as DropdownPosition;
    } else {
      this.position = this.position.replace('end', 'start') as DropdownPosition;
    }
  }

  getAnimationTransform(): string {
    return this.position.startsWith('top')
      ? 'translateY(10px)'
      : 'translateY(-10px)';
  }
}
