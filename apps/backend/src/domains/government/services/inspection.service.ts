import { InspectionModel, IInspectionDocument } from '../models/inspection.model';

export class InspectionService {
  async scheduleInspection(data: Partial<IInspectionDocument>) {
    const inspection = new InspectionModel(data);
    await inspection.save();
    return inspection;
  }

  async completeInspection(inspectionId: string, officerId: string, data: Partial<IInspectionDocument>) {
    return InspectionModel.findOneAndUpdate(
      { _id: inspectionId, officerId },
      { ...data, completedTime: new Date() },
      { new: true }
    );
  }

  async getInspectionsForIssue(issueId: string) {
    return InspectionModel.find({ issueId }).sort({ scheduledTime: -1 });
  }

  async getInspectionsForOfficer(officerId: string) {
    return InspectionModel.find({ officerId }).sort({ scheduledTime: -1 });
  }
}

export const inspectionService = new InspectionService();
