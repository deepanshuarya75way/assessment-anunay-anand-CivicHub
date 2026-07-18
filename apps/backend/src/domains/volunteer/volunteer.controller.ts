import { Request, Response, NextFunction } from 'express';
import { volunteerProfileService } from './services/profile.service';
import { campaignService } from './services/campaign.service';
import { taskService } from './services/task.service';
import { registrationService } from './services/registration.service';
import { volunteerHourService } from './services/hour.service';

export class VolunteerController {
  // --- Profiles ---
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const profile = await volunteerProfileService.getOrCreateProfile(userId);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      // In real app, ensure (req as any).user.id === userId
      const profile = await volunteerProfileService.updateProfile(userId, req.body);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  // --- Campaigns ---
  async createCampaign(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = (req as any).user!.id;
      const campaign = await campaignService.createCampaign(organizerId, req.body);
      res.status(201).json(campaign);
    } catch (error) {
      next(error);
    }
  }

  async getCampaigns(req: Request, res: Response, next: NextFunction) {
    try {
      const campaigns = await campaignService.listCampaigns(req.query);
      res.json(campaigns);
    } catch (error) {
      next(error);
    }
  }

  async getCampaign(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const campaign = await campaignService.getCampaign(id);
      res.json(campaign);
    } catch (error) {
      next(error);
    }
  }

  // --- Tasks ---
  async createCampaignTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const task = await taskService.createTask(id, req.body);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  async getCampaignTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const tasks = await taskService.getCampaignTasks(id);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }

  async assignTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const userId = (req as any).user!.id;
      const task = await taskService.assignTask(taskId, userId);
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  // --- Registrations ---
  async joinCampaign(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user!.id;
      const registration = await registrationService.register(id, userId);
      res.status(201).json(registration);
    } catch (error) {
      next(error);
    }
  }

  async getCampaignRegistrations(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const registrations = await registrationService.getCampaignRegistrations(id);
      res.json(registrations);
    } catch (error) {
      next(error);
    }
  }
}

export const volunteerController = new VolunteerController();
