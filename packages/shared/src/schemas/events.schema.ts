import { z } from 'zod';

// Space Reference
export const EventSpaceReferenceSchema = z.object({
  type: z.enum(['global', 'community', 'organization']),
  id: z.string().optional(), // Empty if global
});
export type EventSpaceReference = z.infer<typeof EventSpaceReferenceSchema>;

import { GeoJSONPointSchema } from './civic.schema';

// Event Status
export const EventStatus = z.enum([
  'DRAFT',
  'PUBLISHED',
  'REGISTRATION_OPEN',
  'REGISTRATION_CLOSED',
  'LIVE',
  'COMPLETED',
  'ARCHIVED',
  'CANCELLED'
]);
export type EventStatus = z.infer<typeof EventStatus>;

// Announcement Priority
export const AnnouncementPriority = z.enum(['NORMAL', 'IMPORTANT', 'EMERGENCY']);
export type AnnouncementPriority = z.infer<typeof AnnouncementPriority>;

// Embedded Announcement
export const AnnouncementSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  message: z.string().min(1),
  priority: AnnouncementPriority.default('NORMAL'),
  postedBy: z.string(), // userId
  postedAt: z.date(),
});
export type Announcement = z.infer<typeof AnnouncementSchema>;

// Embedded Schedule Item
export const ScheduleItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  speaker: z.string().optional(),
  startTime: z.date(),
  endTime: z.date(),
  location: z.string().optional(),
});
export type ScheduleItem = z.infer<typeof ScheduleItemSchema>;

// Event Media
export const EventMediaSchema = z.object({
  bannerId: z.string().optional(), // ID referencing media domain
  attachmentIds: z.array(z.string()).default([]), // IDs referencing media domain
});
export type EventMedia = z.infer<typeof EventMediaSchema>;

// Event Aggregate Root
export const EventSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  description: z.string().min(10),
  eventType: z.string(),
  space: EventSpaceReferenceSchema,
  organizerId: z.string(), // userId
  relatedCampaigns: z.array(z.string()).default([]),
  relatedIssues: z.array(z.string()).default([]),
  location: GeoJSONPointSchema.optional(),
  address: z.string().optional(),
  capacity: z.number().min(1).optional(),
  registrationLimit: z.number().optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'COMMUNITY_ONLY']).default('PUBLIC'),
  startTime: z.date(),
  endTime: z.date(),
  media: EventMediaSchema.default({ attachmentIds: [] }),
  status: EventStatus.default('DRAFT'),
  schedules: z.array(ScheduleItemSchema).default([]),
  announcements: z.array(AnnouncementSchema).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Event = z.infer<typeof EventSchema>;

// Attendance Status
export const AttendanceStatus = z.enum([
  'REGISTERED',
  'WAITLISTED',
  'CHECKED_IN',
  'ATTENDED',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW'
]);
export type AttendanceStatus = z.infer<typeof AttendanceStatus>;

// Event Completion (for certificates, etc)
export const EventCompletionSchema = z.object({
  approvedBy: z.string(), // userId
  approvedAt: z.date(),
  eligibleForCertificate: z.boolean().default(false),
});
export type EventCompletion = z.infer<typeof EventCompletionSchema>;

// Attendance Aggregate
export const AttendanceSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  userId: z.string(),
  status: AttendanceStatus.default('REGISTERED'),
  registeredAt: z.date(),
  checkInTime: z.date().optional(),
  checkOutTime: z.date().optional(),
  hoursEarned: z.number().optional(),
  checkedInBy: z.string().optional(), // userId of organizer who checked them in
  checkedOutBy: z.string().optional(), // userId of organizer who checked them out
  checkInMethod: z.string().optional(), // e.g., 'QR', 'MANUAL'
  deviceInfo: z.string().optional(),
  verificationSource: z.string().optional(),
  completion: EventCompletionSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Attendance = z.infer<typeof AttendanceSchema>;
