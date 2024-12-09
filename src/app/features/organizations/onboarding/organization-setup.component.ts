import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { OrganizationService } from '../../../core/services/organization.service';

@Component({
  selector: 'app-organization-setup',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">
            Organization Setup Complete!
          </h1>
          <p class="mt-2 text-gray-600">
            Your organization has been created successfully. What would you like
            to do next?
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <mat-card class="hover:shadow-lg transition-shadow">
            <mat-card-content class="p-6">
              <div class="flex flex-col items-center text-center">
                <mat-icon class="text-4xl mb-4 text-primary-500">
                  group_add
                </mat-icon>
                <h2 class="text-xl font-semibold mb-2">Invite Team Members</h2>
                <p class="text-gray-600 mb-4">
                  Start collaborating by inviting your team members to join your
                  organization
                </p>
                <button
                  mat-flat-button
                  color="primary"
                  (click)="
                    router.navigate([
                      '/',
                      'organizations',
                      currentOrg()?.slug,
                      'members'
                    ])
                  "
                >
                  Invite Members
                </button>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="hover:shadow-lg transition-shadow">
            <mat-card-content class="p-6">
              <div class="flex flex-col items-center text-center">
                <mat-icon class="text-4xl mb-4 text-primary-500">
                  rocket_launch
                </mat-icon>
                <h2 class="text-xl font-semibold mb-2">Create First Project</h2>
                <p class="text-gray-600 mb-4">
                  Get started by creating your first project and setting up your
                  workflow
                </p>
                <button
                  mat-flat-button
                  color="primary"
                  (click)="
                    router.navigate([
                      '/',
                      'organizations',
                      currentOrg()?.slug,
                      'projects',
                      'new'
                    ])
                  "
                >
                  Create Project
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="mt-8 text-center">
          <button
            mat-stroked-button
            (click)="router.navigate(['/', 'dashboard'])"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  `,
})
export class OrganizationSetupComponent {
  private organizationService = inject(OrganizationService);
  protected router = inject(Router);
  protected currentOrg = this.organizationService.currentOrg;
}
