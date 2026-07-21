import { CampaignModel, ICampaignDocument } from '../models/campaign.model';
import { Campaign, CampaignStatus } from '@civichub/shared';
import { NotFoundError, ValidationError } from '../../../core/exceptions';
import { EventBus } from '../../../core/events/event.bus';
import { EventTopic } from '../../../core/events/event.types';
import { UserModel } from '../../identity/models/user.model';
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
    const campaign = await CampaignModel.findById(campaignId).lean();
    if (!campaign) throw new NotFoundError('Campaign not found');

    const organizer = await UserModel.findById(campaign.organizerId).lean();
    if (organizer) {
      campaign.organizerName = `${organizer.firstName} ${organizer.lastName}`;
    }

    return campaign as unknown as ICampaignDocument;
  }

  async updateCampaignStatus(campaignId: string, status: z.infer<typeof CampaignStatus>, userId: string): Promise<ICampaignDocument> {
    const campaign = await this.getCampaign(campaignId);
    
    // In a real app, verify userId is the organizer or has permissions
    if (campaign.organizerId !== userId) {
      throw new ValidationError('Only the organizer can update the campaign status');
    }

    await CampaignModel.updateOne({ _id: campaignId }, { status });
    campaign.status = status;

    await EventBus.publish(EventTopic.VOLUNTEER_CAMPAIGN_UPDATED, { campaignId, status });
    return campaign;
  }

  async listCampaigns(filters: any = {}): Promise<ICampaignDocument[]> {
    const campaigns = await CampaignModel.find(filters).sort({ startDate: 1 }).lean();
    
    // Fetch all organizers
    const organizerIds = Array.from(new Set(campaigns.map(c => c.organizerId)));
    const organizers = await UserModel.find({ _id: { $in: organizerIds } }).lean();
    const organizerMap = organizers.reduce((acc, user) => {
      acc[user._id.toString()] = `${user.firstName} ${user.lastName}`;
      return acc;
    }, {} as Record<string, string>);

    return campaigns.map(c => ({
      ...c,
      organizerName: organizerMap[c.organizerId] || c.organizerId
    })) as unknown as ICampaignDocument[];
  }

  async updateCampaign(campaignId: string, data: Partial<Campaign>, userId: string): Promise<ICampaignDocument> {
    const campaign = await this.getCampaign(campaignId);
    
    if (campaign.organizerId !== userId) {
      throw new ValidationError('Only the organizer can update the campaign');
    }

    await CampaignModel.updateOne({ _id: campaignId }, data);
    return this.getCampaign(campaignId);
  }

  async deleteCampaign(campaignId: string, userId: string): Promise<void> {
    const campaign = await this.getCampaign(campaignId);
    
    if (campaign.organizerId !== userId) {
      throw new ValidationError('Only the organizer can delete the campaign');
    }

    await CampaignModel.findByIdAndDelete(campaignId);
  }
}

export const campaignService = new CampaignService();
