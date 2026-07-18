import { AssignmentModel, IAssignmentDocument } from '../models/assignment.model';
import { AssignmentStatus } from '@civichub/shared';

export class AssignmentService {
  async assignIssue(data: Partial<IAssignmentDocument>) {
    // Only one active assignment per issue typically, or we could support multiple.
    // Assuming one primary assignment.
    await AssignmentModel.updateMany(
      { issueId: data.issueId, status: { $in: [AssignmentStatus.PENDING_ACCEPTANCE, AssignmentStatus.ACCEPTED, AssignmentStatus.IN_PROGRESS] } },
      { status: AssignmentStatus.TRANSFERRED }
    );

    const assignment = new AssignmentModel({
      ...data,
      status: AssignmentStatus.PENDING_ACCEPTANCE
    });
    await assignment.save();
    return assignment;
  }

  async acceptAssignment(assignmentId: string, officerId: string) {
    return AssignmentModel.findOneAndUpdate(
      { _id: assignmentId, officerId },
      { status: AssignmentStatus.ACCEPTED, acceptedAt: new Date() },
      { new: true }
    );
  }

  async completeAssignment(assignmentId: string, officerId: string) {
    return AssignmentModel.findOneAndUpdate(
      { _id: assignmentId, officerId },
      { status: AssignmentStatus.COMPLETED, completedAt: new Date() },
      { new: true }
    );
  }

  async getAssignmentsForOfficer(officerId: string) {
    return AssignmentModel.find({ officerId }).sort({ createdAt: -1 });
  }
}

export const assignmentService = new AssignmentService();
