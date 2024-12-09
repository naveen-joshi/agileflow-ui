import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grid-pattern',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grid-pattern.component.html',
  styleUrls: ['./grid-pattern.component.scss'],
})
export class GridPatternComponent {
  @Input() size = 200;
  @Input() spacing = 20;
  @Input() dotSize = 1;
  @Input() color = 'currentColor';
  @Input() id = `grid-pattern-${Math.random().toString(36).substr(2, 9)}`;
}
