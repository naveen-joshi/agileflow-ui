import { Component, HostListener, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  animate,
  style,
  transition,
  trigger,
  query,
  stagger,
} from '@angular/animations';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LinkComponent } from '@shared/components/link/link.component';
import { MatIconModule } from '@angular/material/icon';
import { DotsPatternComponent } from '../../shared/components/patterns/dots-pattern.component';
import { IntersectionObserverDirective } from '@shared/directives/intersection-observer.directive';
import { CirclesPatternComponent } from '@shared/components/patterns/circles-pattern.component';
import { ViewportScroller } from '@angular/common';
import { RedirectService } from '@core/services/redirect.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonComponent,
    LinkComponent,
    MatIconModule,
    IntersectionObserverDirective,
    DotsPatternComponent,
    CirclesPatternComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '600ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('mobileMenu', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translateX(100%)' })
        ),
      ]),
    ]),
    trigger('featureAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate(
          '500ms cubic-bezier(0.35, 0, 0.25, 1)',
          style({ opacity: 1, transform: 'scale(1)' })
        ),
      ]),
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger('100ms', [
              animate(
                '500ms cubic-bezier(0.35, 0, 0.25, 1)',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class LandingComponent {
  isHeaderVisible = signal(true);
  isMobileMenuOpen = signal(false);
  private lastScrollPosition = 0;
  private scrollY = signal(0);
  private viewportHeight = signal(0);

  // Navigation links
  navLinks = [
    { path: '/features', label: 'Features' },
    { path: '/solutions', label: 'Solutions' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/resources', label: 'Resources' },
  ];

  // Stats data
  stats = [
    { value: '10k+', label: 'Active Users' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support' },
  ];

  // Products data
  products = [
    {
      name: 'AgileFlow',
      description: 'AI-powered project management and team collaboration',
      icon: 'assets/images/products/agileflow-icon.svg',
      features: [
        'Smart task automation',
        'AI-driven insights',
        'Team analytics',
        'Custom workflows',
      ],
    },
    {
      name: 'MeetFlow',
      description: 'Intelligent meeting management and scheduling',
      icon: 'assets/images/products/meetflow-icon.svg',
      features: [
        'AI meeting summaries',
        'Smart scheduling',
        'Action item tracking',
        'Meeting analytics',
      ],
    },
    {
      name: 'TalentFlow',
      description: 'AI-enhanced HR and talent management',
      icon: 'assets/images/products/talentflow-icon.svg',
      features: [
        'AI recruitment',
        'Performance tracking',
        'Skills analysis',
        'Career planning',
      ],
    },
  ];

  // Features data
  features = [
    {
      icon: 'auto_awesome',
      title: 'AI-Powered Automation',
      description:
        'Automate repetitive tasks and workflows with advanced AI capabilities',
    },
    {
      icon: 'insights',
      title: 'Smart Analytics',
      description: 'Get actionable insights and data-driven recommendations',
    },
    {
      icon: 'integration_instructions',
      title: 'Seamless Integration',
      description:
        'Connect with your favorite tools and platforms effortlessly',
    },
    {
      icon: 'security',
      title: 'Enterprise Security',
      description: 'Bank-grade security and compliance features built-in',
    },
  ];

  // Testimonials
  testimonials = [
    {
      quote:
        'AgileFlow has transformed how we manage projects. The AI features are game-changing.',
      author: 'Sarah Johnson',
      role: 'CTO at TechCorp',
      avatar: 'assets/images/testimonials/sarah.jpg',
    },
    {
      quote:
        "The best project management tool we've ever used. It's intuitive and powerful.",
      author: 'Michael Chen',
      role: 'Product Manager at InnovateCo',
      avatar: 'assets/images/testimonials/michael.jpg',
    },
  ];

  // Track which features are visible
  visibleFeatures = signal<Set<string>>(new Set());

  private router = inject(Router);
  private redirectService = inject(RedirectService);
  private authService = inject(AuthService);

  constructor(private viewportScroller: ViewportScroller) {
    this.viewportHeight.set(window.innerHeight);
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const currentScroll = window.scrollY;
    this.isHeaderVisible.set(
      currentScroll < this.lastScrollPosition || currentScroll < 100
    );
    this.lastScrollPosition = currentScroll;

    this.scrollY.set(window.scrollY);
  }

  @HostListener('window:resize')
  toggleMobileMenu() {
    this.isMobileMenuOpen.update((value) => !value);
  }

  onFeatureVisible(isVisible: boolean, featureTitle: string) {
    this.visibleFeatures.update((features) => {
      const newFeatures = new Set(features);
      if (isVisible) {
        newFeatures.add(featureTitle);
      } else {
        newFeatures.delete(featureTitle);
      }
      return newFeatures;
    });
  }

  isFeatureVisible(title: string): boolean {
    return this.visibleFeatures().has(title);
  }

  getParallaxStyle(speed: number = 0.5): string {
    const scrollProgress = this.scrollY() * speed;
    return `translateY(${scrollProgress}px)`;
  }

  navigateToProduct(product: string) {
    this.redirectService.setRedirectProduct(product as 'agileflow' | 'meetflow');
    
    if (this.authService.isAuthenticated()) {
      // If already authenticated, navigate directly
      if (product === 'agileflow') {
        this.router.navigate(['/app/organizations/onboarding']);
      } else {
        this.router.navigate(['/meetings']);
      }
    } else {
      // If not authenticated, redirect to login
      this.router.navigate(['/auth/login']);
    }
  }
}
