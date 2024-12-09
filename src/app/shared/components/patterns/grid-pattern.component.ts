import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grid-pattern',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          [id]="id"
          [attr.width]="spacing"
          [attr.height]="spacing"
          patternUnits="userSpaceOnUse"
        >
          <circle
            [attr.cx]="spacing / 2"
            [attr.cy]="spacing / 2"
            [attr.r]="dotSize"
            [attr.fill]="color"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" [attr.fill]="'url(#' + id + ')'" />
    </svg>
  `,
  styles: [
    `
      :host {
        display: block;
        overflow: hidden;
      }
    `,
  ],
})
export class GridPatternComponent {
  @Input() size = 200;
  @Input() spacing = 20;
  @Input() dotSize = 1;
  @Input() color = 'currentColor';
  @Input() id = `grid-pattern-${Math.random().toString(36).substr(2, 9)}`;
}
