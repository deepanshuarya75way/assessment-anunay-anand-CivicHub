import { TenantModel, ITenantDocument } from '../models/tenant.model';

export class TenantService {
  async createTenant(data: Partial<ITenantDocument>) {
    const tenant = new TenantModel(data);
    await tenant.save();
    return tenant;
  }

  async getTenantById(id: string) {
    return TenantModel.findById(id);
  }

  async listTenants() {
    return TenantModel.find({ active: true });
  }
}

export const tenantService = new TenantService();
