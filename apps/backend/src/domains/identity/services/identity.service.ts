import { UserModel } from '../models/user.model';
import { UserUpdateProfileInput } from '@civichub/shared';
import { NotFoundError } from '../../../core/exceptions';
import { SessionService } from '../../auth/services/session.service';

export class IdentityService {
  static async getProfile(userId: string) {
    const user = await UserModel.findById(userId).select('-password');
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  static async updateProfile(userId: string, data: UserUpdateProfileInput) {
    const user = await UserModel.findByIdAndUpdate(userId, data, { new: true }).select('-password');
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  static async deleteAccount(userId: string) {
    // Soft delete or hard delete based on business rules. Let's hard delete for now.
    await UserModel.findByIdAndDelete(userId);
    // Revoke all active sessions
    await SessionService.revokeAllUserSessions(userId);
  }
}
