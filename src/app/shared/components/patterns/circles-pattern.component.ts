import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-circles-pattern',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          [id]="id"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="20"
            cy="20"
            r="18"
            [attr.stroke]="color"
            stroke-width="0.5"
            fill="none"
          />
          <circle
            cx="20"
            cy="20"
            r="12"
            [attr.stroke]="color"
            stroke-width="0.5"
            fill="none"
          />
          <circle
            cx="20"
            cy="20"
            r="6"
            [attr.stroke]="color"
            stroke-width="0.5"
            fill="none"
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

      svg {
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class CirclesPatternComponent {
  @Input() size = 200;
  @Input() color = 'currentColor';
  @Input() id = `circles-pattern-${Math.random().toString(36).substr(2, 9)}`;
}
