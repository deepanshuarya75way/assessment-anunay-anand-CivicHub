import { z } from 'zod';

// Volunteer Profile
export const VolunteerProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  skills: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  availability: z.array(z.string()).default([]), // e.g. "Weekends", "Evenings"
  languages: z.array(z.string()).default([]),
  experience: z.string().optional(),
  isVerified: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type VolunteerProfile = z.infer<typeof VolunteerProfileSchema>;

// Space Reference for Campaigns
export const SpaceReferenceSchema = z.object({
  type: z.enum(['global', 'community', 'organization']),
  id: z.string().optional(), // Empty if global
});
export type SpaceReference = z.infer<typeof SpaceReferenceSchema>;

// Campaign Status
export const CampaignStatus = z.enum([
  'DRAFT',
  'PUBLISHED',
  'REGISTRATION_OPEN',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'ARCHIVED',
]);

// Campaign
export const CampaignSchema = z.object({
  id: z.string(),
  title: z.string().min(5),
  description: z.string().min(10),
  objectives: z.array(z.string()).default([]),
  organizerId: z.string(), // userId of the organizer
  space: SpaceReferenceSchema,
  relatedIssues: z.array(z.string()).default([]), // Array of issue IDs
  startDate: z.date(),
  endDate: z.date(),
  capacity: z.number().min(1),
  status: CampaignStatus.default('DRAFT'),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Campaign = z.infer<typeof CampaignSchema>;

// Campaign Checklist (Optional prep items)
export const CampaignChecklistSchema = z.object({
  id: z.string(),
  campaignId: z.string(),
  title: z.string().min(3),
  completed: z.boolean().default(false),
  completedBy: z.string().optional(), // userId
  completedAt: z.date().optional(),
  createdAt: z.date(),
});
export type CampaignChecklist = z.infer<typeof CampaignChecklistSchema>;

// Task Priority
export const TaskPriority = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

// Task Status
export const TaskStatus = z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']);

// Task
export const TaskSchema = z.object({
  id: z.string(),
  campaignId: z.string(),
  title: z.string().min(3),
  description: z.string().min(5),
  requiredSkills: z.array(z.string()).default([]),
  assignees: z.array(z.string()).default([]), // userIds
  maxVolunteers: z.number().min(1).default(1),
  status: TaskStatus.default('TODO'),
  priority: TaskPriority.default('MEDIUM'),
  estimatedEffort: z.number().optional(), // in hours
  assignedAt: z.date().optional(),
  completedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Task = z.infer<typeof TaskSchema>;

// Registration Status
export const RegistrationStatus = z.enum([
  'REGISTERED',
  'CHECKED_IN',
  'ACTIVE',
  'COMPLETED',
  'WITHDRAWN',
  'REMOVED',
]);

// Registration
export const RegistrationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  campaignId: z.string(),
  status: RegistrationStatus.default('REGISTERED'),
  registeredAt: z.date(),
  updatedAt: z.date(),
});
export type Registration = z.infer<typeof RegistrationSchema>;

// Volunteer Hour (Ledger)
export const VolunteerHourSchema = z.object({
  id: z.string(),
  userId: z.string(),
  campaignId: z.string().optional(),
  taskId: z.string().optional(),
  hours: z.number().min(0.5),
  approvedBy: z.string().optional(), // userId of approver
  recordedAt: z.date(),
  createdAt: z.date(),
});
export type VolunteerHour = z.infer<typeof VolunteerHourSchema>;
