import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { KeyboardNavigationService } from './core/services/keyboard-navigation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  template: `
    <router-outlet />
    <app-toast />
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  private keyboardNav = inject(KeyboardNavigationService);

  ngOnInit() {
    this.keyboardNav.initialize();
  }

  ngOnDestroy() {
    this.keyboardNav.destroy();
  }
}
