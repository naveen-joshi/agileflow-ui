import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dots-pattern',
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
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="2" [attr.fill]="color" fill-opacity="0.3" />
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
export class DotsPatternComponent {
  @Input() size = 200;
  @Input() color = 'currentColor';
  @Input() id = `dots-pattern-${Math.random().toString(36).substr(2, 9)}`;
}
