import { z } from 'zod';

export enum NotificationPriority {
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.string(), // e.g. 'NEW_ASSIGNMENT', 'SLA_BREACH', 'INSPECTION_SCHEDULED'
  title: z.string(),
  message: z.string(),
  priority: z.nativeEnum(NotificationPriority).default(NotificationPriority.NORMAL),
  resourceType: z.string().optional(),
  resourceId: z.string().optional(),
  read: z.boolean().default(false),
  createdAt: z.date()
});

export type Notification = z.infer<typeof NotificationSchema>;
