import { OfficerModel, IOfficerDocument } from '../models/officer.model';

export class OfficerService {
  async registerOfficer(data: Partial<IOfficerDocument>) {
    const officer = new OfficerModel(data);
    await officer.save();
    return officer;
  }

  async getOfficerProfile(userId: string) {
    return OfficerModel.findOne({ userId });
  }

  async listOfficersByDepartment(tenantId: string, department: string) {
    return OfficerModel.find({
      tenantId,
      $or: [
        { primaryDepartment: department },
        { secondaryDepartments: department }
      ]
    });
  }

  async updateOfficerStatus(userId: string, active: boolean) {
    return OfficerModel.findOneAndUpdate({ userId }, { active }, { new: true });
  }
}

export const officerService = new OfficerService();
