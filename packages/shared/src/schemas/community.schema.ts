import { z } from 'zod';

export enum CommunityVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  RESTRICTED = 'RESTRICTED',
}

export enum CommunityRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  MEMBER = 'MEMBER',
}

export enum CommunityMemberStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  BANNED = 'BANNED',
}

export const CreateCommunitySchema = z.object({
  name: z.string().min(3).max(100),
  slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500),
  visibility: z.nativeEnum(CommunityVisibility).default(CommunityVisibility.PUBLIC),
  categories: z.array(z.string()).max(5).optional(),
});

export const UpdateCommunitySchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  coverUrl: z.string().url().optional(),
  rules: z.array(z.string()).max(10).optional(),
  tags: z.array(z.string()).max(10).optional(),
  visibility: z.nativeEnum(CommunityVisibility).optional(),
});

export type CreateCommunityInput = z.infer<typeof CreateCommunitySchema>;
export type UpdateCommunityInput = z.infer<typeof UpdateCommunitySchema>;

export interface ICommunity {
  id: string;
  name: string;
  slug: string;
  description: string;
  avatarUrl?: string;
  coverUrl?: string;
  rules: string[];
  tags: string[];
  visibility: CommunityVisibility;
  categories: string[];
  memberCount: number;
  postCount: number;
  lastActivityAt: Date;
  verified: boolean;
  featured: boolean;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommunityMember {
  id: string;
  communityId: string;
  userId: string;
  role: CommunityRole;
  status: CommunityMemberStatus;
  joinedAt: Date;
  updatedAt: Date;
}
