import { z } from 'zod';
import { UserRole } from './identity.schema';

export const TenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  region: z.string(),
  active: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const OfficerProfileSchema = z.object({
  id: z.string(),
  userId: z.string(), // Foreign key to User
  tenantId: z.string(),
  employeeId: z.string(),
  designation: z.string(),
  primaryDepartment: z.string(), // Department ID or Name
  secondaryDepartments: z.array(z.string()).default([]),
  supervisorId: z.string().optional(), // Officer ID
  officeLocation: z.string().optional(),
  contactInfo: z.record(z.string()).optional(),
  active: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date()
});

export enum SLAPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export const SLAPolicySchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  department: z.string(),
  category: z.string(),
  priority: z.nativeEnum(SLAPriority),
  targetResponseHours: z.number(), // Target time to initial response
  targetResolutionHours: z.number(), // Target time to resolution
  active: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date()
});

export enum AssignmentStatus {
  PENDING_ACCEPTANCE = 'PENDING_ACCEPTANCE',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  TRANSFERRED = 'TRANSFERRED'
}

export const AssignmentSchema = z.object({
  id: z.string(),
  issueId: z.string(),
  officerId: z.string(),
  assignedBy: z.string(), // Officer ID or 'SYSTEM'
  assignedAt: z.date(),
  acceptedAt: z.date().optional(),
  completedAt: z.date().optional(),
  status: z.nativeEnum(AssignmentStatus),
  priority: z.nativeEnum(SLAPriority),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const InspectionSchema = z.object({
  id: z.string(),
  issueId: z.string(),
  officerId: z.string(),
  scheduledTime: z.date(),
  completedTime: z.date().optional(),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]) // [longitude, latitude]
  }).optional(),
  weatherConditions: z.string().optional(),
  checklist: z.array(z.object({
    task: z.string(),
    completed: z.boolean()
  })).default([]),
  findings: z.string().optional(),
  recommendations: z.string().optional(),
  mediaIds: z.array(z.string()).default([]), // References to uploaded media
  followUpRequired: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Tenant = z.infer<typeof TenantSchema>;
export type OfficerProfile = z.infer<typeof OfficerProfileSchema>;
export type SLAPolicy = z.infer<typeof SLAPolicySchema>;
export type Assignment = z.infer<typeof AssignmentSchema>;
export type Inspection = z.infer<typeof InspectionSchema>;
