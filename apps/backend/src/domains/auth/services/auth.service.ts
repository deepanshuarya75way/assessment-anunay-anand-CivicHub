import { UserModel } from '../../identity/models/user.model';
import { ProfileModel } from '../../identity/models/profile.model';
import { PreferencesModel } from '../../identity/models/preferences.model';
import { TokenModel, TokenType } from '../models/token.model';
import { CryptoService } from '../../../core/security/crypto.service';
import { JwtService } from '../../../core/security/jwt.service';
import { SessionService } from './session.service';
import { emailProvider } from '../../../core/providers/implementations/email.provider';
import { AuditService, AuditAction } from '../../../core/audit/audit.service';
import { AccountStatus, LoginInput, UserRegistrationInput } from '@civichub/shared';
import { AuthenticationError, ConflictError, NotFoundError } from '../../../core/exceptions';
import { redis } from '../../../core/config/redis';
import crypto from 'crypto';

export class AuthService {
  private static readonly MAX_FAILED_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60; // 15 mins in seconds

  static async register(data: UserRegistrationInput) {
    const existingUser = await UserModel.findOne({ email: data.email });
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const hashedPassword = await CryptoService.hash(data.password);
    const user = await UserModel.create({
      ...data,
      password: hashedPassword,
      status: AccountStatus.PENDING_VERIFICATION,
    });

    // Generate username
    const baseUsername = `${data.firstName.toLowerCase()}${data.lastName.toLowerCase()}`.replace(/[^a-z0-9]/g, '');
    const randomSuffix = crypto.randomBytes(2).toString('hex');
    const username = `${baseUsername}${randomSuffix}`;

    // Provision Profile & Preferences
    await ProfileModel.create({
      userId: user._id,
      username,
    });
    
    await PreferencesModel.create({
      userId: user._id,
    });

    // Generate Verification Token
    const plainToken = crypto.randomUUID();
    const tokenHash = await CryptoService.hash(plainToken);
    
    await TokenModel.create({
      userId: user._id,
      tokenHash,
      type: TokenType.EMAIL_VERIFICATION,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    const verifyUrl = `http://localhost:5173/verify-email?token=${plainToken}&uid=${user._id.toString()}`;
    await emailProvider.sendEmail(
      user.email,
      'Verify Your CivicHub Account',
      `Please verify your email by clicking: ${verifyUrl}`
    );

    await AuditService.log({ action: AuditAction.USER_REGISTER, userId: user._id.toString() });

    return { message: 'Registration successful. Please check your email to verify your account.' };
  }

  static async verifyEmail(uid: string, token: string) {
    const user = await UserModel.findById(uid);
    if (!user) throw new NotFoundError('User not found');

    if (user.status === AccountStatus.ACTIVE) {
      return { message: 'Email already verified' };
    }

    const verificationToken = await TokenModel.findOne({ userId: user._id, type: TokenType.EMAIL_VERIFICATION });
    if (!verificationToken) {
      throw new AuthenticationError('Invalid or expired verification token');
    }

    const isValid = await CryptoService.verify(verificationToken.tokenHash, token);
    if (!isValid) {
      throw new AuthenticationError('Invalid verification token');
    }

    user.status = AccountStatus.ACTIVE;
    await user.save();
    await verificationToken.deleteOne();

    await AuditService.log({ action: AuditAction.USER_PROFILE_UPDATE, userId: user._id.toString(), details: { event: 'EMAIL_VERIFIED' } });

    return { message: 'Email verified successfully' };
  }

  static async login(data: LoginInput, ipAddress?: string, userAgent?: string, deviceId?: string) {
    const lockKey = `login_attempts:${data.email}`;
    const attempts = await redis.get(lockKey);
    
    if (attempts && parseInt(attempts) >= this.MAX_FAILED_ATTEMPTS) {
      throw new AuthenticationError('Account locked due to too many failed login attempts. Please try again later.');
    }

    const user = await UserModel.findOne({ email: data.email });
    if (!user || !user.password) {
      await this.incrementFailedAttempts(lockKey);
      throw new AuthenticationError('Invalid email or password');
    }

    const isMatch = await CryptoService.verify(user.password, data.password);
    if (!isMatch) {
      await this.incrementFailedAttempts(lockKey);
      throw new AuthenticationError('Invalid email or password');
    }

    if (user.status === AccountStatus.BANNED || user.status === AccountStatus.SUSPENDED || user.status === AccountStatus.DELETED) {
      throw new AuthenticationError(`Account is ${user.status.toLowerCase()}. Please contact support.`);
    }

    // Reset attempts on successful login
    await redis.del(lockKey);

    const jti = crypto.randomUUID();
    const accessToken = JwtService.generateToken({
      id: user._id.toString(),
      role: user.role,
      status: user.status,
      tokenVersion: user.tokenVersion,
      jti,
    });

    const { session, refreshToken, familyId } = await SessionService.createSession(
      user._id.toString(),
      deviceId,
      userAgent,
      ipAddress
    );

    await AuditService.log({ action: AuditAction.USER_LOGIN, userId: user._id.toString(), ipAddress, userAgent });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
      },
    };
  }

  static async refresh(refreshToken: string) {
    const { newRefreshToken, familyId } = await SessionService.rotateRefreshToken(refreshToken);
    
    // Find session to get user
    const sessionModelObj = await SessionService.getSessionByFamilyId(familyId);
    if (!sessionModelObj) throw new AuthenticationError('Session not found');

    const user = await UserModel.findById(sessionModelObj.userId);
    if (!user || user.status === AccountStatus.BANNED || user.status === AccountStatus.SUSPENDED) {
      await SessionService.revokeFamily(familyId);
      throw new AuthenticationError('User is no longer active');
    }

    const jti = crypto.randomUUID();
    const accessToken = JwtService.generateToken({
      id: user._id.toString(),
      role: user.role,
      status: user.status,
      tokenVersion: user.tokenVersion,
      jti,
    });

    return { accessToken, refreshToken: newRefreshToken };
  }

  static async logout(refreshToken: string, accessToken?: string) {
    // In a real implementation, we extract familyId from redis, then revoke
    const familyData = await redis.get(`refresh_token:${refreshToken}`);
    if (familyData && !familyData.startsWith('USED:')) {
      await SessionService.revokeFamily(familyData);
    }
    
    // Blacklist the current access token
    if (accessToken) {
      try {
        const decoded = JwtService.verifyToken<any>(accessToken);
        if (decoded.jti) {
           // expire in 15 minutes (match JWT expiration)
           await redis.setex(`bl_${decoded.jti}`, 15 * 60, 'true');
        }
      } catch (e) {
        // Token might already be expired, ignore
      }
    }
  }

  static async logoutAllDevices(userId: string) {
    const user = await UserModel.findById(userId);
    if (user) {
      user.tokenVersion += 1;
      await user.save();
    }
    await SessionService.revokeAllUserSessions(userId);
  }

  private static async incrementFailedAttempts(key: string) {
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, this.LOCKOUT_DURATION);
    }
  }
}
