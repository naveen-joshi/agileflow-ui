import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wave-pattern',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wave-pattern.component.html',
  styleUrls: ['./wave-pattern.component.scss'],
})
export class WavePatternComponent {
  @Input() width = '100%';
  @Input() height = 'auto';
  @Input() color = 'currentColor';
  @Input() flip = false;
}
