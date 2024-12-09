import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { animate, style, transition, trigger } from '@angular/animations';
import { TestimonialInterface } from './testimonial.interface';

@Component({
  selector: 'app-testimonial-carousel',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './testimonial-carousel.component.html',
  styleUrls: ['./testimonial-carousel.component.scss'],
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate(
          '500ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '500ms ease-in',
          style({ opacity: 0, transform: 'translateX(-100%)' })
        ),
      ]),
    ]),
  ],
})
export class TestimonialCarouselComponent {
  @Input() testimonials: TestimonialInterface[] = [];
  currentIndex = signal(0);

  next() {
    this.currentIndex.update((index) =>
      index === this.testimonials.length - 1 ? 0 : index + 1
    );
  }

  previous() {
    this.currentIndex.update((index) =>
      index === 0 ? this.testimonials.length - 1 : index - 1
    );
  }
}
