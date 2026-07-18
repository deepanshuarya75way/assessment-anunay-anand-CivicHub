import { z } from 'zod';

// Shared Enums
export const IssueStatus = z.enum([
  'reported',
  'verified',
  'assigned',
  'in_progress',
  'resolved',
  'closed',
]);

// Location: GeoJSON Point
export const GeoJSONPointSchema = z.object({
  type: z.literal('Point'),
  coordinates: z.tuple([z.number(), z.number()]), // [longitude, latitude]
});
export type GeoJSONPoint = z.infer<typeof GeoJSONPointSchema>;

// Media Attachment
export const AttachmentSchema = z.object({
  mediaId: z.string(),
  url: z.string(),
  metadata: z.record(z.any()).optional(),
});
export type Attachment = z.infer<typeof AttachmentSchema>;

// Workflow History
export const WorkflowHistorySchema = z.object({
  status: IssueStatus,
  changedBy: z.string(), // userId
  timestamp: z.date(),
  note: z.string().optional(),
});
export type WorkflowHistory = z.infer<typeof WorkflowHistorySchema>;

// Department (Reference Data)
export const DepartmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Department = z.infer<typeof DepartmentSchema>;

// Category (Reference Data)
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.string().optional(), // For subcategories e.g. Infrastructure -> Roads
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Category = z.infer<typeof CategorySchema>;

// Citizen Update
export const CitizenUpdateSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(10),
  attachments: z.array(AttachmentSchema).optional(),
  createdAt: z.date(),
});
export type CitizenUpdate = z.infer<typeof CitizenUpdateSchema>;

// Civic Issue
export const IssueSchema = z.object({
  id: z.string(),
  title: z.string().min(5),
  description: z.string().min(10),
  categoryId: z.string(),
  reporterId: z.string(),
  assignedDepartmentId: z.string().optional(),
  
  // Location
  location: GeoJSONPointSchema,
  address: z.string().optional(),

  // Workflow
  currentStatus: IssueStatus,
  workflowHistory: z.array(WorkflowHistorySchema),
  
  // Updates
  citizenUpdates: z.array(CitizenUpdateSchema).default([]),

  // Media
  attachments: z.array(AttachmentSchema).optional(),

  // Context (Global, Community, or Organization)
  contextType: z.enum(['global', 'community', 'organization']),
  contextId: z.string().optional(),

  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Issue = z.infer<typeof IssueSchema>;

// Issue Support (Upvotes)
export const IssueSupportSchema = z.object({
  id: z.string(),
  issueId: z.string(),
  userId: z.string(),
  createdAt: z.date(),
});
export type IssueSupport = z.infer<typeof IssueSupportSchema>;

// Issue Watcher
export const IssueWatcherSchema = z.object({
  id: z.string(),
  issueId: z.string(),
  userId: z.string(),
  createdAt: z.date(),
});
export type IssueWatcher = z.infer<typeof IssueWatcherSchema>;

// Duplicate Issue
export const DuplicateIssueSchema = z.object({
  id: z.string(),
  duplicateId: z.string(),
  primaryId: z.string(),
  reason: z.string().optional(),
  mergedAt: z.date(),
  mergedBy: z.string(),
});
export type DuplicateIssue = z.infer<typeof DuplicateIssueSchema>;
