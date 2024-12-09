import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

type LinkVariant = 'default' | 'primary' | 'secondary' | 'subtle';
type LinkSize = 'sm' | 'md' | 'lg';
type IconPosition = 'left' | 'right';

@Component({
  selector: 'app-link',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <a
      [routerLink]="!disabled ? to : null"
      [class]="linkClasses"
      [attr.target]="external ? '_blank' : null"
      [attr.rel]="external ? 'noopener noreferrer' : null"
      [attr.disabled]="disabled ? '' : null"
      (click)="disabled ? $event.preventDefault() : null"
    >
      @if (icon && iconPosition === 'left') {
      <mat-icon class="icon-left">{{ icon }}</mat-icon>
      }

      <ng-content></ng-content>

      @if (icon && iconPosition === 'right') {
      <mat-icon class="icon-right">{{ icon }}</mat-icon>
      }
    </a>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }

      a {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;

        &[disabled] {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }
      }
    `,
  ],
})
export class LinkComponent {
  @Input() to!: string;
  @Input() variant: LinkVariant = 'default';
  @Input() size: LinkSize = 'md';
  @Input() external = false;
  @Input() underline = true;
  @Input() block = false;
  @Input() disabled = false;
  @Input() icon: string | null = null;
  @Input() iconPosition: IconPosition = 'left';

  get linkClasses(): string {
    return [
      // Base styles
      'transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',

      // Variants
      this.variantClasses,

      // Sizes
      this.sizeClasses,

      // Optional styles
      this.underline ? 'hover:underline' : '',
      this.block ? 'block w-full' : 'inline-flex',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private get variantClasses(): string {
    const variants = {
      default: 'text-gray-700 hover:text-gray-900',
      primary: 'text-primary-600 hover:text-primary-700',
      secondary: 'text-secondary-600 hover:text-secondary-700',
      subtle: 'text-gray-500 hover:text-gray-700',
    };
    return variants[this.variant];
  }

  private get sizeClasses(): string {
    const sizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };
    return sizes[this.size];
  }
}
