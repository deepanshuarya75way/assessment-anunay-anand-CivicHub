import { CommunityModel } from '../models/community.model';
import { CommunityMemberModel } from '../models/community-member.model';
import { CreateCommunityInput, UpdateCommunityInput, CommunityRole, CommunityMemberStatus } from '@civichub/shared';
import { NotFoundError, ConflictError, AuthorizationError } from '../../../core/exceptions';
import { EventBus } from '../../../core/events/event.bus';
import { EventTopic } from '../../../core/events/event.types';

export class CommunityService {
  static async createCommunity(userId: string, data: CreateCommunityInput) {
    const existing = await CommunityModel.findOne({ slug: data.slug });
    if (existing) {
      throw new ConflictError('Community slug already taken');
    }

    const community = await CommunityModel.create({
      ...data,
      creatorId: userId,
      memberCount: 1, // Creator is the first member
    });

    await CommunityMemberModel.create({
      communityId: community._id.toString(),
      userId,
      role: CommunityRole.OWNER,
      status: CommunityMemberStatus.APPROVED,
    });

    await EventBus.publish(EventTopic.COMMUNITIES_CREATED, {
      communityId: community._id.toString(),
      creatorId: userId,
    });

    return community;
  }

  static async getCommunityBySlug(slug: string) {
    const community = await CommunityModel.findOne({ slug });
    if (!community) throw new NotFoundError('Community not found');
    return community;
  }

  static async updateCommunity(communityId: string, userId: string, data: UpdateCommunityInput) {
    const member = await CommunityMemberModel.findOne({ communityId, userId });
    if (!member || (member.role !== CommunityRole.OWNER && member.role !== CommunityRole.ADMIN)) {
      throw new AuthorizationError('You do not have permission to update this community');
    }

    const community = await CommunityModel.findByIdAndUpdate(
      communityId,
      { $set: data },
      { new: true }
    );
    if (!community) throw new NotFoundError('Community not found');

    await EventBus.publish(EventTopic.COMMUNITIES_UPDATED, {
      communityId,
      userId,
      changes: Object.keys(data),
    });

    return community;
  }

  static async joinCommunity(communityId: string, userId: string) {
    const community = await CommunityModel.findById(communityId);
    if (!community) throw new NotFoundError('Community not found');

    const existingMember = await CommunityMemberModel.findOne({ communityId, userId });
    if (existingMember) {
      if (existingMember.status === CommunityMemberStatus.BANNED) {
        throw new AuthorizationError('You are banned from this community');
      }
      return { message: 'Already a member', status: existingMember.status };
    }

    // If community is private/restricted, status is PENDING, else APPROVED
    const status = community.visibility === 'PUBLIC' ? CommunityMemberStatus.APPROVED : CommunityMemberStatus.PENDING;

    await CommunityMemberModel.create({
      communityId,
      userId,
      role: CommunityRole.MEMBER,
      status,
    });

    if (status === CommunityMemberStatus.APPROVED) {
      await CommunityModel.findByIdAndUpdate(communityId, { $inc: { memberCount: 1 } });
      await EventBus.publish(EventTopic.COMMUNITIES_MEMBER_JOINED, { communityId, userId });
    }

    return { message: 'Successfully joined', status };
  }

  static async getDiscoverCommunities(type: 'trending' | 'newest' | 'suggested' = 'trending') {
    let sortQuery: any = { memberCount: -1 };
    if (type === 'newest') sortQuery = { createdAt: -1 };
    if (type === 'trending') sortQuery = { postCount: -1, lastActivityAt: -1 };

    const communities = await CommunityModel.find({ visibility: 'PUBLIC' })
      .sort(sortQuery)
      .limit(10);
      
    return communities;
  }
}
