import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { animate, style, transition, trigger } from '@angular/animations';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

@Component({
  selector: 'app-testimonial-carousel',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="relative overflow-hidden">
      <div class="flex items-center">
        <!-- Previous Button -->
        <button
          class="absolute left-0 z-10 p-2 text-gray-600 hover:text-gray-900 transition-colors"
          (click)="previous()"
        >
          <mat-icon>chevron_left</mat-icon>
        </button>

        <!-- Testimonials -->
        <div class="w-full">
          @for (testimonial of testimonials; track testimonial.author; let i =
          $index) { @if (currentIndex() === i) {
          <div
            class="flex flex-col items-center text-center px-16"
            [@slideAnimation]
          >
            <img
              [src]="testimonial.avatar"
              [alt]="testimonial.author"
              class="w-20 h-20 rounded-full mb-6 object-cover"
            />
            <blockquote class="text-xl text-gray-900 mb-4">
              "{{ testimonial.quote }}"
            </blockquote>
            <cite class="not-italic">
              <div class="font-semibold text-gray-900">
                {{ testimonial.author }}
              </div>
              <div class="text-gray-600">{{ testimonial.role }}</div>
            </cite>
          </div>
          } }
        </div>

        <!-- Next Button -->
        <button
          class="absolute right-0 z-10 p-2 text-gray-600 hover:text-gray-900 transition-colors"
          (click)="next()"
        >
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>

      <!-- Dots -->
      <div class="flex justify-center gap-2 mt-6">
        @for (dot of testimonials; track dot; let i = $index) {
        <button
          class="w-2 h-2 rounded-full transition-colors"
          [class]="
            i === currentIndex()
              ? 'bg-primary-600'
              : 'bg-gray-300 hover:bg-gray-400'
          "
          (click)="currentIndex.set(i)"
        ></button>
        }
      </div>
    </div>
  `,
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
  @Input() testimonials: Testimonial[] = [];
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
