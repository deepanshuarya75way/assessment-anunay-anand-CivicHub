import { Request, Response, NextFunction } from 'express';
import { CommunityService } from './services/community.service';
import { ApiResponse } from '../../core/utils/ApiResponse';
import { AuthRequest } from '../../core/middlewares/auth.middleware';
import { CreateCommunitySchema, UpdateCommunitySchema } from '@civichub/shared';

export class CommunitiesController {
  static async createCommunity(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = CreateCommunitySchema.parse(req.body);
      const community = await CommunityService.createCommunity(req.user!.id, data);
      return ApiResponse.success(res, community, 'Community created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  static async getCommunity(req: Request, res: Response, next: NextFunction) {
    try {
      const community = await CommunityService.getCommunityBySlug(req.params.slug);
      return ApiResponse.success(res, community);
    } catch (err) {
      next(err);
    }
  }

  static async updateCommunity(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = UpdateCommunitySchema.parse(req.body);
      const community = await CommunityService.updateCommunity(req.params.id, req.user!.id, data);
      return ApiResponse.success(res, community, 'Community updated successfully');
    } catch (err) {
      next(err);
    }
  }

  static async joinCommunity(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await CommunityService.joinCommunity(req.params.id, req.user!.id);
      return ApiResponse.success(res, result, result.message);
    } catch (err) {
      next(err);
    }
  }

  static async discoverCommunities(req: Request, res: Response, next: NextFunction) {
    try {
      const type = (req.query.type as any) || 'trending';
      const communities = await CommunityService.getDiscoverCommunities(type);
      return ApiResponse.success(res, communities);
    } catch (err) {
      next(err);
    }
  }
}
