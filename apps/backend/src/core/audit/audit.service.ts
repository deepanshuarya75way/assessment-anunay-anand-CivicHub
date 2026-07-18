import { logger } from '../logging/logger';

export enum AuditAction {
  USER_REGISTER = 'USER_REGISTER',
  USER_LOGIN = 'USER_LOGIN',
  USER_PASSWORD_RESET = 'USER_PASSWORD_RESET',
  USER_PROFILE_UPDATE = 'USER_PROFILE_UPDATE',
  CIVIC_ISSUE_CREATE = 'CIVIC_ISSUE_CREATE',
  ADMIN_ACTION = 'ADMIN_ACTION',
}

export interface AuditEvent {
  action: AuditAction;
  userId?: string;
  targetId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  static async log(event: AuditEvent): Promise<void> {
    // In the future, this might write to an AuditLog mongoose model or external service
    // For now, we utilize the application logger
    logger.info(`[AUDIT] ${event.action}`, { audit: event });
  }
}
