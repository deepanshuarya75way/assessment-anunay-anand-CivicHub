import { z } from 'zod';

export const AuditLogSchema = z.object({
  id: z.string(),
  actorId: z.string(), // ID of the user performing the action
  actorRole: z.string(),
  action: z.string(), // e.g. 'CREATE_ASSIGNMENT', 'UPDATE_SLA'
  resourceType: z.string(), // e.g. 'ISSUE', 'ASSIGNMENT'
  resourceId: z.string(),
  changes: z.record(z.any()).optional(), // previous state vs new state
  ipAddress: z.string().optional(),
  device: z.string().optional(),
  createdAt: z.date()
});

export type AuditLog = z.infer<typeof AuditLogSchema>;
