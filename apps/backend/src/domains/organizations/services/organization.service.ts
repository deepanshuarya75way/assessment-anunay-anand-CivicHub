import { OrganizationModel } from '../models/organization.model';
import { OrganizationMemberModel } from '../models/organization-member.model';
import { CreateOrganizationInput, UpdateOrganizationInput, OrganizationRole, OrganizationVerificationStatus } from '@civichub/shared';
import { NotFoundError, ConflictError, AuthorizationError } from '../../../core/exceptions';
import { EventBus } from '../../../core/events/event.bus';
import { EventTopic } from '../../../core/events/event.types';

export class OrganizationService {
  static async createOrganization(userId: string, data: CreateOrganizationInput) {
    const existing = await OrganizationModel.findOne({ slug: data.slug });
    if (existing) {
      throw new ConflictError('Organization slug already taken');
    }

    const organization = await OrganizationModel.create({
      ...data,
      creatorId: userId,
      memberCount: 1, // Creator is the first member
    });

    await OrganizationMemberModel.create({
      organizationId: organization._id.toString(),
      userId,
      role: OrganizationRole.ADMIN,
    });

    await EventBus.publish(EventTopic.ORGANIZATIONS_CREATED, {
      organizationId: organization._id.toString(),
      creatorId: userId,
    });

    return organization;
  }

  static async getOrganizationBySlug(slug: string) {
    const organization = await OrganizationModel.findOne({ slug });
    if (!organization) throw new NotFoundError('Organization not found');
    return organization;
  }

  static async updateOrganization(organizationId: string, userId: string, data: UpdateOrganizationInput) {
    const member = await OrganizationMemberModel.findOne({ organizationId, userId });
    if (!member || member.role !== OrganizationRole.ADMIN) {
      throw new AuthorizationError('You do not have permission to update this organization');
    }

    const organization = await OrganizationModel.findByIdAndUpdate(
      organizationId,
      { $set: data },
      { new: true }
    );
    if (!organization) throw new NotFoundError('Organization not found');

    return organization;
  }

  // Verification is typically an admin-only action, left simple for now
  static async verifyOrganization(organizationId: string, status: OrganizationVerificationStatus) {
    const organization = await OrganizationModel.findByIdAndUpdate(
      organizationId,
      { verificationStatus: status },
      { new: true }
    );
    if (!organization) throw new NotFoundError('Organization not found');

    if (status === OrganizationVerificationStatus.VERIFIED) {
      await EventBus.publish(EventTopic.ORGANIZATIONS_VERIFIED, { organizationId });
    }

    return organization;
  }
}
