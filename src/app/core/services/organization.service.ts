import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  Organization,
  CreateOrganizationDto,
} from '../../shared/interfaces/organization.interface';
import {
  TeamMember,
  InviteTeamMemberDto,
  TeamRole,
} from '../../shared/interfaces/team.interface';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private toastService = inject(ToastService);

  // State management
  private organizations = signal<Organization[]>([]);
  private currentOrganization = signal<Organization | null>(null);
  private teamMembers = signal<TeamMember[]>([]);

  // Computed values
  readonly organizationsList = computed(() => this.organizations());
  readonly currentOrg = computed(() => this.currentOrganization());
  readonly teamMembersList = computed(() => this.teamMembers());
  hasCompletedOnboarding$ = computed(
    () => this.currentOrganization()?.onboardingCompleted ?? false
  );

  // Load user's organizations
  loadOrganizations() {
    return this.http
      .get<Organization[]>(`${environment.apiUrl}/organizations`)
      .subscribe({
        next: (orgs) => this.organizations.set(orgs),
        error: () =>
          this.toastService.show('Failed to load organizations', 'error'),
      });
  }

  // Create new organization
  createOrganization(data: CreateOrganizationDto): Observable<Organization> {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.logo) {
      formData.append('logo', data.logo);
    }

    return this.http.post<Organization>(
      `${environment.apiUrl}/organizations`,
      formData
    );
  }

  // Set current organization
  setCurrentOrganization(slug: string) {
    const org = this.organizations().find((o) => o.slug === slug);
    if (org) {
      this.currentOrganization.set(org);
      this.loadTeamMembers(org.id);
    }
  }

  // Load team members
  private loadTeamMembers(organizationId: string) {
    return this.http
      .get<TeamMember[]>(
        `${environment.apiUrl}/organizations/${organizationId}/members`
      )
      .subscribe({
        next: (members) => this.teamMembers.set(members),
        error: () =>
          this.toastService.show('Failed to load team members', 'error'),
      });
  }

  // Invite team member
  inviteTeamMember(
    orgId: string,
    data: InviteTeamMemberDto
  ): Observable<TeamMember> {
    return this.http.post<TeamMember>(
      `${environment.apiUrl}/organizations/${orgId}/invites`,
      data
    );
  }

  // Update team member role
  updateTeamMemberRole(memberId: string, role: TeamRole) {
    return this.http
      .patch<TeamMember>(
        `${environment.apiUrl}/organizations/members/${memberId}`,
        { role }
      )
      .subscribe({
        next: (updatedMember) => {
          this.teamMembers.update((members) =>
            members.map((m) => (m.id === memberId ? updatedMember : m))
          );
          this.toastService.show('Role updated successfully', 'success');
        },
        error: () => this.toastService.show('Failed to update role', 'error'),
      });
  }

  // Remove team member
  removeTeamMember(memberId: string) {
    return this.http
      .delete(`${environment.apiUrl}/organizations/members/${memberId}`)
      .subscribe({
        next: () => {
          this.teamMembers.update((members) =>
            members.filter((m) => m.id !== memberId)
          );
          this.toastService.show('Member removed successfully', 'success');
        },
        error: () => this.toastService.show('Failed to remove member', 'error'),
      });
  }
}
