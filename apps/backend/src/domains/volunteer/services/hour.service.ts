import { VolunteerHourModel, IVolunteerHourDocument } from '../models/hour.model';
import { VolunteerHour } from '@civichub/shared';
import { NotFoundError } from '../../../core/exceptions';
import { EventBus } from '../../../core/events/event.bus';
import { EventTopic } from '../../../core/events/event.types';

export class VolunteerHourService {
  async recordHours(userId: string, data: Partial<VolunteerHour>): Promise<IVolunteerHourDocument> {
    const record = await VolunteerHourModel.create({
      ...data,
      userId,
      recordedAt: data.recordedAt || new Date(),
    });

    await EventBus.publish(EventTopic.VOLUNTEER_HOUR_RECORDED, { recordId: record.id, userId, hours: record.hours });
    return record;
  }

  async getUserHours(userId: string): Promise<IVolunteerHourDocument[]> {
    return VolunteerHourModel.find({ userId }).sort({ recordedAt: -1 });
  }

  async getTotalUserHours(userId: string): Promise<number> {
    const result = await VolunteerHourModel.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: '$hours' } } }
    ]);

    return result.length > 0 ? result[0].total : 0;
  }

  async getCampaignHours(campaignId: string): Promise<number> {
    const result = await VolunteerHourModel.aggregate([
      { $match: { campaignId } },
      { $group: { _id: null, total: { $sum: '$hours' } } }
    ]);

    return result.length > 0 ? result[0].total : 0;
  }
}

export const volunteerHourService = new VolunteerHourService();
