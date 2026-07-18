import { CampaignModel, ICampaignDocument } from '../models/campaign.model';
import { Campaign, CampaignStatus } from '@civichub/shared';
import { NotFoundError, ValidationError } from '../../../core/exceptions';
import { EventBus } from '../../../core/events/event.bus';
import { EventTopic } from '../../../core/events/event.types';
import { z } from 'zod';

export class CampaignService {
  async createCampaign(organizerId: string, data: Partial<Campaign>): Promise<ICampaignDocument> {
    const campaign = await CampaignModel.create({
      ...data,
      organizerId,
      status: 'DRAFT',
    });

    await EventBus.publish(EventTopic.VOLUNTEER_CAMPAIGN_CREATED, { campaignId: campaign.id, organizerId });
    return campaign;
  }

  async getCampaign(campaignId: string): Promise<ICampaignDocument> {
    const campaign = await CampaignModel.findById(campaignId);
    if (!campaign) throw new NotFoundError('Campaign not found');
    return campaign;
  }

  async updateCampaignStatus(campaignId: string, status: z.infer<typeof CampaignStatus>, userId: string): Promise<ICampaignDocument> {
    const campaign = await this.getCampaign(campaignId);
    
    // In a real app, verify userId is the organizer or has permissions
    if (campaign.organizerId !== userId) {
      throw new ValidationError('Only the organizer can update the campaign status');
    }

    campaign.status = status;
    await campaign.save();

    await EventBus.publish(EventTopic.VOLUNTEER_CAMPAIGN_UPDATED, { campaignId: campaign.id, status });
    return campaign;
  }

  async listCampaigns(filters: any = {}): Promise<ICampaignDocument[]> {
    return CampaignModel.find(filters).sort({ startDate: 1 });
  }
}

export const campaignService = new CampaignService();
