import { ProfileModel, IProfileDocument } from '../models/profile.model';
import { ProfileUpdateInput } from '@civichub/shared';
import { NotFoundError, ConflictError } from '../../../core/exceptions';
import mongoose from 'mongoose';

const RESERVED_USERNAMES = new Set([
  'admin', 'support', 'system', 'api', 'government', 
  'civichub', 'official', 'help', 'null', 'undefined'
]);

export class ProfileService {
  static async getProfileByUsername(username: string) {
    const profile = await ProfileModel.findOne({ username: username.toLowerCase() }).populate('userId', 'firstName lastName role status');
    if (!profile) throw new NotFoundError('Profile not found');
    return profile;
  }

  static async getProfileByUserId(userId: string) {
    const profile = await ProfileModel.findOne({ userId }).populate('userId', 'firstName lastName role status');
    if (!profile) throw new NotFoundError('Profile not found');
    return profile;
  }

  static async updateProfile(userId: string, data: ProfileUpdateInput & { avatarUrl?: string, coverUrl?: string }) {
    const profile = await ProfileModel.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true }
    );
    if (!profile) throw new NotFoundError('Profile not found');
    
    // In a real app we might emit 'identity.profile.updated' here
    
    return profile;
  }

  static async checkUsernameAvailability(username: string): Promise<boolean> {
    const normalized = username.toLowerCase();
    if (RESERVED_USERNAMES.has(normalized)) return false;
    
    const existing = await ProfileModel.findOne({ username: normalized });
    return !existing;
  }
  
  static async updateUsername(userId: string, username: string) {
    const isAvailable = await this.checkUsernameAvailability(username);
    if (!isAvailable) throw new ConflictError('Username is not available');
    
    const profile = await ProfileModel.findOneAndUpdate(
      { userId },
      { username: username.toLowerCase() },
      { new: true }
    );
    
    if (!profile) throw new NotFoundError('Profile not found');
    
    // Emit 'identity.username.changed'
    
    return profile;
  }
}
