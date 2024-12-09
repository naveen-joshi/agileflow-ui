import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenuComponent {
  @Input() items: NavItem[] = [];
  @Input() collapsed = false;
}
