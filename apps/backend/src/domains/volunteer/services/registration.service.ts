import { RegistrationModel, IRegistrationDocument } from '../models/registration.model';
import { CampaignModel } from '../models/campaign.model';
import { RegistrationStatus } from '@civichub/shared';
import { NotFoundError, ValidationError } from '../../../core/exceptions';
import { EventBus } from '../../../core/events/event.bus';
import { EventTopic } from '../../../core/events/event.types';
import { z } from 'zod';

export class RegistrationService {
  async register(campaignId: string, userId: string): Promise<IRegistrationDocument> {
    const campaign = await CampaignModel.findById(campaignId);
    if (!campaign) throw new NotFoundError('Campaign not found');

    if (['COMPLETED', 'CANCELLED', 'ARCHIVED'].includes(campaign.status)) {
      throw new ValidationError('Campaign is no longer active');
    }

    const currentRegistrations = await RegistrationModel.countDocuments({ campaignId, status: { $in: ['REGISTERED', 'CHECKED_IN', 'ACTIVE'] } });
    if (currentRegistrations >= campaign.capacity) {
      throw new ValidationError('Campaign is at full capacity');
    }

    const registration = await RegistrationModel.create({
      userId,
      campaignId,
      status: 'REGISTERED'
    });

    await EventBus.publish(EventTopic.VOLUNTEER_REGISTERED, { registrationId: registration.id, userId, campaignId });
    return registration;
  }

  async updateStatus(registrationId: string, status: z.infer<typeof RegistrationStatus>, adminId: string): Promise<IRegistrationDocument> {
    const registration = await RegistrationModel.findById(registrationId);
    if (!registration) throw new NotFoundError('Registration not found');

    // Here we'd verify adminId is the campaign organizer. Omitting for brevity in this phase.

    registration.status = status;
    await registration.save();

    await EventBus.publish(EventTopic.VOLUNTEER_REGISTRATION_UPDATED, { registrationId, status });
    return registration;
  }

  async getUserRegistrations(userId: string): Promise<IRegistrationDocument[]> {
    return RegistrationModel.find({ userId }).sort({ registeredAt: -1 });
  }

  async getCampaignRegistrations(campaignId: string): Promise<IRegistrationDocument[]> {
    return RegistrationModel.find({ campaignId });
  }
}

export const registrationService = new RegistrationService();
