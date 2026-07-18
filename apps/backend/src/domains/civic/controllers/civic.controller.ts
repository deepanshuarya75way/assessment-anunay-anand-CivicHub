import { Request, Response, NextFunction } from 'express';
import { civicService } from '../services/civic.service';
import { IssueModel } from '../models/issue.model';
import { DepartmentModel } from '../models/department.model';
import { CategoryModel } from '../models/category.model';
import { AuthRequest } from '../../../core/middlewares/auth.middleware';

export class CivicController {
  
  async createIssue(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const issue = await civicService.createIssue(req.body, req.user!.id);
      res.status(201).json(issue);
    } catch (error) {
      next(error);
    }
  }

  async getIssues(req: Request, res: Response, next: NextFunction) {
    try {
      const issues = await IssueModel.find().sort({ createdAt: -1 }).limit(50);
      res.json(issues);
    } catch (error) {
      next(error);
    }
  }

  async getIssueById(req: Request, res: Response, next: NextFunction) {
    try {
      const issue = await IssueModel.findById(req.params.id);
      if (!issue) return res.status(404).json({ message: 'Issue not found' });
      res.json(issue);
    } catch (error) {
      next(error);
    }
  }

  async transitionState(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status, note } = req.body;
      const issue = await civicService.transitionIssueState(req.params.id, status, req.user!.id, note);
      res.json(issue);
    } catch (error) {
      next(error);
    }
  }

  async watchIssue(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await civicService.watchIssue(req.params.id, req.user!.id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async unwatchIssue(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await civicService.unwatchIssue(req.params.id, req.user!.id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async supportIssue(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await civicService.supportIssue(req.params.id, req.user!.id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async removeSupport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await civicService.removeSupport(req.params.id, req.user!.id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async addCitizenUpdate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { text, attachments } = req.body;
      const issue = await civicService.addCitizenUpdate(req.params.id, req.user!.id, text, attachments);
      res.json(issue);
    } catch (error) {
      next(error);
    }
  }

  async markAsDuplicate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { primaryId, reason } = req.body;
      const duplicateId = req.params.id;
      const issue = await civicService.markAsDuplicate(duplicateId, primaryId, req.user!.id, reason);
      res.json(issue);
    } catch (error) {
      next(error);
    }
  }

  async getUnifiedActivityFeed(req: Request, res: Response, next: NextFunction) {
    try {
      const feed = await civicService.getUnifiedActivityFeed(req.params.id);
      res.json(feed);
    } catch (error) {
      next(error);
    }
  }

  // Reference Data endpoints
  async getDepartments(req: Request, res: Response, next: NextFunction) {
    try {
      const departments = await DepartmentModel.find().sort({ name: 1 });
      res.json(departments);
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryModel.find().sort({ name: 1 });
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }
}

export const civicController = new CivicController();
