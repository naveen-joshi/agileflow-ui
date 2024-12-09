export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  onboardingCompleted: boolean;
}

export interface CreateOrganizationDto {
  name: string;
  logo?: File | null;
}
