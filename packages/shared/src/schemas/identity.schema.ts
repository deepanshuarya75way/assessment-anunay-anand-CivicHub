import { z } from 'zod';

export enum AccountStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
  DELETED = 'DELETED',
}

export const UserRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
});

export const UserUpdateProfileSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
});

export const ProfileUpdateSchema = z.object({
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal('')),
  socialLinks: z.record(z.string()).optional(),
  privacy: z.object({
    profileVisibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
    showActivity: z.boolean().optional(),
    showBookmarks: z.boolean().optional(),
    showCommunities: z.boolean().optional(),
    allowMentions: z.boolean().optional(),
    allowMessages: z.boolean().optional(),
  }).optional(),
});

export const PreferencesUpdateSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  notificationSettings: z.record(z.boolean()).optional(),
  feedPreferences: z.record(z.any()).optional(),
});

export type UserRegistrationInput = z.infer<typeof UserRegistrationSchema>;
export type UserUpdateProfileInput = z.infer<typeof UserUpdateProfileSchema>;
export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;
export type PreferencesUpdateInput = z.infer<typeof PreferencesUpdateSchema>;

export enum UserRole {
  CITIZEN = 'CITIZEN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  GOV_ADMIN = 'GOV_ADMIN',
  DEPT_HEAD = 'DEPT_HEAD',
  SUPERVISOR = 'SUPERVISOR',
  OFFICER = 'OFFICER',
  INSPECTOR = 'INSPECTOR',
}

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: AccountStatus;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProfile {
  id: string;
  userId: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  location?: string;
  website?: string;
  socialLinks?: Record<string, string>;
  privacy: {
    profileVisibility: 'PUBLIC' | 'PRIVATE';
    showActivity: boolean;
    showBookmarks: boolean;
    showCommunities: boolean;
    allowMentions: boolean;
    allowMessages: boolean;
  };
  reputation: {
    score: number;
    level: string;
    contributions: number;
    posts: number;
    comments: number;
    helpfulVotes: number;
    civicPoints: number;
    volunteerPoints: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IPreferences {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notificationSettings: Record<string, boolean>;
  feedPreferences: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
