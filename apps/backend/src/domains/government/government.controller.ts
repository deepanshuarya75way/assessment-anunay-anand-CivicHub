import { Request, Response } from 'express';
import { officerService } from './services/officer.service';
import { assignmentService } from './services/assignment.service';
import { UserRole } from '@civichub/shared';

export class GovernmentController {
  // Mock feature flag check
  private isFeatureEnabled(feature: string): boolean {
    // In production, fetch from Redis or FeatureFlag service
    return process.env.ENABLE_GOV_FEATURES === 'true' || true;
  }

  async getMyWorkspace(req: Request, res: Response) {
    if (!this.isFeatureEnabled('GOV_WORKSPACE')) {
      return res.status(403).json({ success: false, message: 'Government portal is currently disabled.' });
    }

    try {
      const user = (req as any).user;
      const profile = await officerService.getOfficerProfile(user.id);
      
      if (!profile) {
        return res.status(404).json({ success: false, message: 'Officer profile not found.' });
      }

      const assignments = await assignmentService.getAssignmentsForOfficer(profile.id);
      
      res.json({
        success: true,
        data: {
          profile,
          assignments
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Placeholder for Analytics
  async getDashboardAnalytics(req: Request, res: Response) {
    res.json({
      success: true,
      data: {
        activeIssues: 142,
        slaBreaches: 3,
        inspectionsScheduled: 12
      }
    });
  }
}

export const governmentController = new GovernmentController();
