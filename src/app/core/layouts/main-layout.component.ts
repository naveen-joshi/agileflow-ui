import {
  Component,
  Input,
  signal,
  computed,
  effect,
  ViewChild,
  inject,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterOutlet,
  RouterLink,
  NavigationEnd,
} from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { filter } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
  HammerModule,
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG,
} from '@angular/platform-browser';
import {
  animate,
  style,
  transition,
  trigger,
  state,
} from '@angular/animations';

import { AuthService } from '../services/auth.service';
import { HapticEngine } from '@shared/services/haptic.engine';
import { NotificationsMenuComponent } from '@shared/components/notifications/notifications-menu.component';
import { SearchInputComponent } from '@shared/components/forms/search-input.component';
import { NavMenuComponent } from '@shared/components/navigation/nav-menu.component';
import {
  Notification,
  Breadcrumb,
  SearchResult,
  NavItem
} from './interfaces/main-layout.interface';
import { DropdownMenuComponent } from '@shared/components/dropdown/dropdown-menu.component';
import { DropdownItemComponent } from '@shared/components/dropdown/dropdown-item.component';

export interface ProductConfig {
  name: string;
  logoPath: string;
  navigationItems: NavItem[];
}

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    HammerModule,
    NotificationsMenuComponent,
    SearchInputComponent,
    NavMenuComponent,
    DropdownMenuComponent,
    DropdownItemComponent,
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerGestureConfig,
    },
  ],
  animations: [
    trigger('notificationAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(
          '200ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' })
        ),
      ]),
    ]),
    trigger('slideInOut', [
      state(
        'void',
        style({
          transform: 'translateX(-100%)',
          opacity: 0,
        })
      ),
      state(
        '*',
        style({
          transform: 'translateX(0)',
          opacity: 1,
        })
      ),
      transition(':enter', [animate('200ms ease-out')]),
      transition(':leave', [animate('200ms ease-in')]),
    ]),
  ],
})
export class MainLayoutComponent {
  @Input() productConfig?: ProductConfig;

  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('sidenav', { read: ElementRef })
  sidenavEl!: ElementRef<HTMLElement>;
  @ViewChild('userMenu') userMenu!: MatMenu;

  private router = inject(Router);
  private authService = inject(AuthService);
  private breakpointObserver = inject(BreakpointObserver);
  private hapticEngine = inject(HapticEngine);

  currentUser = this.authService.currentUser;
  isMobile = signal(false);
  sidenavExpanded = signal(true);
  isHovered = signal(false);
  userAvatar = 'assets/images/avatar.jpg';
  isDarkTheme = signal(false);
  unreadCount = signal(0);
  notifications = signal<Notification[]>([]);
  breadcrumbs = signal<Breadcrumb[]>([]);
  searchQuery = signal('');
  searchResults = signal<SearchResult[]>([]);
  swipeProgress = signal(0);
  hasTriggeredHaptic = false;
  userMenuOpen = false;

  readonly defaultConfig: ProductConfig = {
    name: 'AgileFlow',
    logoPath: 'assets/images/products/agileflow-icon.svg',
    navigationItems: [
      {
        label: 'Dashboard',
        icon: 'dashboard',
        path: '/app/dashboard',
      },
      {
        label: 'Projects',
        icon: 'folder',
        path: '/app/projects',
      },
      {
        label: 'Teams',
        icon: 'people',
        path: '/app/teams',
      },
      {
        label: 'Settings',
        icon: 'settings',
        path: '/app/settings',
      },
    ],
  };

  activeConfig = computed(() => this.productConfig || this.defaultConfig);

  navItems = computed(() => this.activeConfig().navigationItems);

  private startX = 0;
  private threshold = 50; // minimum distance for swipe
  private readonly edgeSize = 30; // size of edge area to start swipe

  isInMeeting = computed(() => this.router.url.includes('/app/meetings/join/'));

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.isDarkTheme.set(savedTheme === 'dark' || (!savedTheme && prefersDark));
    if (this.isDarkTheme()) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    }

    // Listen to route changes for breadcrumbs
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe(() => {
        this.updateBreadcrumbs();
      });

    // Mock notifications - replace with real data
    this.loadNotifications();

    effect(() => {
      if (this.searchQuery()) {
        this.performSearch(this.searchQuery());
      }
    });

    // Watch for screen size changes
    this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .subscribe((result) => {
        this.isMobile.set(result.matches);
        if (result.matches || this.isInMeeting()) {
          this.sidenav?.close();
        } else {
          if (this.sidenavExpanded()) {
            this.sidenav?.open();
          }
        }
      });
  }

  toggleSidenav() {
    if (this.isMobile()) {
      this.sidenav.toggle();
    } else {
      this.sidenavExpanded.set(!this.sidenavExpanded());
      this.triggerResize();
    }
  }

  onSidenavHover(isHovered: boolean) {
    if (!this.isMobile()) {
      this.isHovered.set(isHovered);
      if (!this.sidenavExpanded() && isHovered) {
        // Don't change sidenavExpanded state on hover
        // Let CSS handle the hover effect
      }
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  toggleTheme() {
    this.isDarkTheme.set(!this.isDarkTheme());
    if (this.isDarkTheme()) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', this.isDarkTheme() ? 'dark' : 'light');
  }

  private updateBreadcrumbs() {
    const paths = this.router.url.split('/').filter(Boolean);
    const breadcrumbs: Breadcrumb[] = [];
    let currentPath = '';

    paths.forEach((path) => {
      currentPath += `/${path}`;
      breadcrumbs.push({
        label: this.formatBreadcrumb(path),
        path: currentPath,
      });
    });

    this.breadcrumbs.set(breadcrumbs);
  }

  private formatBreadcrumb(path: string): string {
    return path
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  markAllAsRead() {
    this.notifications.update((notifications) =>
      notifications.map((n) => ({ ...n, read: true }))
    );
    this.updateUnreadCount();
  }

  onNotificationClick(notification: Notification) {
    // Handle notification click
    notification.read = true;
    this.updateUnreadCount();
  }

  private updateUnreadCount() {
    this.unreadCount.set(this.notifications().filter((n) => !n.read).length);
  }

  private loadNotifications() {
    // Mock data - replace with API call
    this.notifications.set([
      {
        id: '1',
        message: 'New task assigned to you',
        time: new Date(),
        read: false,
        icon: 'assignment',
      },
      // ... more notifications
    ]);
    this.updateUnreadCount();
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery.set(query);
  }

  private performSearch(query: string) {
    // Mock search - replace with actual API call
    if (!query.trim()) {
      this.searchResults.set([]);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      this.searchResults.set([
        { type: 'project', title: 'Project Alpha', url: '/projects/1' },
        { type: 'task', title: 'Update Documentation', url: '/tasks/1' },
        // ... more results
      ]);
    }, 300);
  }

  // Close sidenav on mobile when clicking outside
  @HostListener('window:click', ['$event'])
  onClick(event: Event) {
    if (this.isMobile() && this.sidenav?.opened) {
      const target = event.target as HTMLElement;
      if (
        !target.closest('mat-sidenav') &&
        !target.closest('button[mat-icon-button]')
      ) {
        this.sidenav.close();
      }
    }
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    if (this.isMobile()) {
      this.startX = event.touches[0].clientX;
    }
  }

  onPan(event: any) {
    if (this.isMobile()) {
      const { deltaX } = event;
      const progress = Math.min(Math.abs(deltaX) / 200, 1);
      this.swipeProgress.set(progress);

      // Haptic feedback at certain thresholds
      if (progress > 0.5 && !this.hasTriggeredHaptic) {
        this.hapticEngine.mediumImpact();
        this.hasTriggeredHaptic = true;
      }

      // Apply smooth transform
      const transform = Math.min(deltaX, 280);
      this.sidenavEl.nativeElement.style.transform = `translateX(${transform}px)`;
    }
  }

  onPanEnd(event: any) {
    if (this.isMobile()) {
      const { deltaX, velocityX } = event;
      const isQuickSwipe = Math.abs(velocityX) > 0.5;

      if (deltaX > this.threshold || (isQuickSwipe && velocityX > 0)) {
        this.sidenav.open();
        this.hapticEngine.successImpact();
      } else {
        this.sidenav.close();
        this.hapticEngine.lightImpact();
      }

      // Reset states
      this.hasTriggeredHaptic = false;
      this.swipeProgress.set(0);
      this.sidenavEl.nativeElement.style.transform = '';
    }
  }

  private triggerResize() {
    // Delay to allow transition to complete
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  }
}
