import { redis } from '../../../core/config/redis';
import { SessionModel } from '../models/session.model';
import crypto from 'crypto';
import { logger } from '../../../core/logging/logger';
import { AuditService, AuditAction } from '../../../core/audit/audit.service';
import mongoose from 'mongoose';

export class SessionService {
  private static readonly REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

  /**
   * Creates a new session and token family
   */
  static async createSession(userId: string, deviceId?: string, userAgent?: string, ipAddress?: string) {
    const familyId = crypto.randomUUID();
    const refreshToken = crypto.randomUUID();

    const expiresAt = new Date(Date.now() + this.REFRESH_TOKEN_EXPIRY * 1000);

    // Save in DB
    const session = await SessionModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      deviceId,
      userAgent,
      ipAddress,
      refreshTokenFamilyId: familyId,
      expiresAt,
    });

    // Save active token in Redis: familyId -> refreshToken
    await redis.setex(`session_family:${familyId}`, this.REFRESH_TOKEN_EXPIRY, refreshToken);
    // Link refresh token back to family for rotation lookup
    await redis.setex(`refresh_token:${refreshToken}`, this.REFRESH_TOKEN_EXPIRY, familyId);

    return { session, refreshToken, familyId };
  }

  /**
   * Validates and rotates a refresh token. Detects reuse.
   */
  static async rotateRefreshToken(oldRefreshToken: string) {
    const familyData = await redis.get(`refresh_token:${oldRefreshToken}`);

    if (!familyData) {
      throw new Error('Invalid or expired refresh token');
    }

    if (familyData.startsWith('USED:')) {
      // REUSE DETECTED!
      const familyId = familyData.split(':')[1];
      logger.warn(`[SECURITY] Refresh token reuse detected for family ${familyId}`);
      await this.revokeFamily(familyId);
      AuditService.log({ action: AuditAction.ADMIN_ACTION, details: { event: 'TOKEN_REUSE_DETECTED', familyId } });
      throw new Error('Refresh token reuse detected. Session revoked.');
    }

    const familyId = familyData;

    // Check if the current active token matches (sanity check)
    const activeTokenForFamily = await redis.get(`session_family:${familyId}`);
    if (activeTokenForFamily !== oldRefreshToken) {
      throw new Error('Invalid refresh token state');
    }

    // Generate new token
    const newRefreshToken = crypto.randomUUID();
    
    // Mark old token as USED to detect future replays (keep for the family's max lifespan, e.g., 7 days)
    await redis.setex(`refresh_token:${oldRefreshToken}`, this.REFRESH_TOKEN_EXPIRY, `USED:${familyId}`);
    
    // Set new token
    await redis.setex(`refresh_token:${newRefreshToken}`, this.REFRESH_TOKEN_EXPIRY, familyId);
    await redis.setex(`session_family:${familyId}`, this.REFRESH_TOKEN_EXPIRY, newRefreshToken);

    // Update DB expiry
    const newExpiry = new Date(Date.now() + this.REFRESH_TOKEN_EXPIRY * 1000);
    await SessionModel.updateMany({ refreshTokenFamilyId: familyId }, { expiresAt: newExpiry });

    return { newRefreshToken, familyId };
  }

  /**
   * Revokes a specific session family (Logout)
   */
  static async revokeFamily(familyId: string) {
    const activeToken = await redis.get(`session_family:${familyId}`);
    if (activeToken) {
      await redis.del(`refresh_token:${activeToken}`);
    }
    await redis.del(`session_family:${familyId}`);
    
    await SessionModel.updateMany({ refreshTokenFamilyId: familyId }, { isValid: false });
  }

  /**
   * Revokes ALL sessions for a user
   */
  static async revokeAllUserSessions(userId: string) {
    const activeSessions = await SessionModel.find({ userId: new mongoose.Types.ObjectId(userId), isValid: true });
    
    for (const session of activeSessions) {
      await this.revokeFamily(session.refreshTokenFamilyId);
    }
  }

  static async getSessionByFamilyId(familyId: string) {
    return SessionModel.findOne({ refreshTokenFamilyId: familyId, isValid: true }).exec();
  }
}
