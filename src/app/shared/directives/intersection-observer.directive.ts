import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appIntersectionObserver]',
  standalone: true,
})
export class IntersectionObserverDirective implements OnInit, OnDestroy {
  @Input() threshold = 0.1;
  @Input() rootMargin = '0px';
  @Output() visible = new EventEmitter<boolean>();

  private observer: IntersectionObserver | undefined;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.visible.emit(entry.isIntersecting);
      },
      {
        threshold: this.threshold,
        rootMargin: this.rootMargin,
      }
    );

    this.observer.observe(this.element.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }
}
