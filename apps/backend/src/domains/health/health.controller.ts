import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ApiResponse } from '../../core/utils/ApiResponse';

export class HealthController {
  static getHealth(req: Request, res: Response) {
    return ApiResponse.success(res, {
      status: 'ok',
      version: process.env.npm_package_version || '1.0.0',
    }, 'Service is healthy');
  }

  static getLive(req: Request, res: Response) {
    return ApiResponse.success(res, {
      uptime: process.uptime(),
      timestamp: Date.now()
    }, 'Service is live');
  }

  static async getReady(req: Request, res: Response) {
    const isDbConnected = mongoose.connection.readyState === 1;
    // We can add Redis check here once the redis client is centralized

    if (isDbConnected) {
      return ApiResponse.success(res, {
        database: 'connected',
      }, 'Service is ready');
    }

    return ApiResponse.error(res, 'Service is not ready', 503, 'SERVICE_UNAVAILABLE', {
      database: isDbConnected ? 'connected' : 'disconnected'
    });
  }
}
