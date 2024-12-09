export type TeamRole = 'owner' | 'admin' | 'member' | 'guest';

export interface TeamMember {
  id: string;
  userId: string;
  organizationId: string;
  role: TeamRole;
  joinedAt: Date;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
}

export interface InviteTeamMemberDto {
  email: string;
  role: TeamRole;
}
