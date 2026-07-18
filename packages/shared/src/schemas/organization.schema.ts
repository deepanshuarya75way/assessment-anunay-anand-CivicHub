import { z } from 'zod';

export enum OrganizationType {
  NGO = 'NGO',
  COLLEGE = 'COLLEGE',
  RWA = 'RWA',
  GOVERNMENT = 'GOVERNMENT',
}

export enum OrganizationVerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum OrganizationRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  VOLUNTEER = 'VOLUNTEER',
}

export const CreateOrganizationSchema = z.object({
  name: z.string().min(3).max(100),
  slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500),
  type: z.nativeEnum(OrganizationType),
  contactEmail: z.string().email(),
});

export const UpdateOrganizationSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  coverUrl: z.string().url().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  website: z.string().url().optional(),
});

export type CreateOrganizationInput = z.infer<typeof CreateOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof UpdateOrganizationSchema>;

export interface IOrganization {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: OrganizationType;
  verificationStatus: OrganizationVerificationStatus;
  contactInfo: {
    email: string;
    phone?: string;
    website?: string;
    address?: string;
  };
  avatarUrl?: string;
  coverUrl?: string;
  officialBadge?: string;
  memberCount: number;
  postCount: number;
  lastActivityAt: Date;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: OrganizationRole;
  joinedAt: Date;
  updatedAt: Date;
}
