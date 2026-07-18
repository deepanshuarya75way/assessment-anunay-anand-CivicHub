import { Request, Response, NextFunction } from 'express';
import { OrganizationService } from './services/organization.service';
import { ApiResponse } from '../../core/utils/ApiResponse';
import { AuthRequest } from '../../core/middlewares/auth.middleware';
import { CreateOrganizationSchema, UpdateOrganizationSchema } from '@civichub/shared';

export class OrganizationsController {
  static async createOrganization(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = CreateOrganizationSchema.parse(req.body);
      const organization = await OrganizationService.createOrganization(req.user!.id, data);
      return ApiResponse.success(res, organization, 'Organization created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  static async getOrganization(req: Request, res: Response, next: NextFunction) {
    try {
      const organization = await OrganizationService.getOrganizationBySlug(req.params.slug);
      return ApiResponse.success(res, organization);
    } catch (err) {
      next(err);
    }
  }

  static async updateOrganization(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = UpdateOrganizationSchema.parse(req.body);
      const organization = await OrganizationService.updateOrganization(req.params.id, req.user!.id, data);
      return ApiResponse.success(res, organization, 'Organization updated successfully');
    } catch (err) {
      next(err);
    }
  }
}
