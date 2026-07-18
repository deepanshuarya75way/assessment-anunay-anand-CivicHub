import { VolunteerProfileModel, IVolunteerProfileDocument } from '../models/profile.model';
import { VolunteerProfile } from '@civichub/shared';
import { NotFoundError } from '../../../core/exceptions';

export class VolunteerProfileService {
  async getProfile(userId: string): Promise<IVolunteerProfileDocument | null> {
    return VolunteerProfileModel.findOne({ userId });
  }

  async getOrCreateProfile(userId: string): Promise<IVolunteerProfileDocument> {
    let profile = await this.getProfile(userId);
    if (!profile) {
      profile = await VolunteerProfileModel.create({ userId });
    }
    return profile;
  }

  async updateProfile(userId: string, data: Partial<VolunteerProfile>): Promise<IVolunteerProfileDocument> {
    const profile = await VolunteerProfileModel.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true, upsert: true }
    );
    return profile;
  }
}

export const volunteerProfileService = new VolunteerProfileService();
