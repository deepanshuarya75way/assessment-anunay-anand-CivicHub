import { SLAPolicyModel, ISLAPolicyDocument } from '../models/sla.model';
import { AssignmentModel } from '../models/assignment.model';
import { SLAPriority } from '@civichub/shared';

export class SLAService {
  async createPolicy(data: Partial<ISLAPolicyDocument>) {
    const policy = new SLAPolicyModel(data);
    await policy.save();
    return policy;
  }

  async getPolicy(tenantId: string, department: string, category: string, priority: SLAPriority) {
    return SLAPolicyModel.findOne({ tenantId, department, category, priority, active: true });
  }

  async checkBreaches() {
    // In a real implementation, this would query Assignments/Issues based on created/accepted times
    // and compare against their associated SLAPolicy.
    // If threshold crossed, we emit a DomainEvent -> NotificationService.
    console.log('[SLAService] Checking for breaches...');
  }
}

export const slaService = new SLAService();
