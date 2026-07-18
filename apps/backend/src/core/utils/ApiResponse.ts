import { Response } from 'express';
import { ApiResponse as IApiResponse, PaginatedData } from '@civichub/shared';

export class ApiResponse {
  static success<T>(res: Response, data: T | null = null, message: string = 'Success', status: number = 200, meta?: Record<string, any>) {
    const payload: IApiResponse<T> = {
      success: true,
      message,
      data,
      meta,
      timestamp: new Date().toISOString(),
      // requestId will be injected by a middleware and added in a formatter if needed, 
      // or we can attach it here if res.locals has it
      requestId: res.locals.requestId,
    };
    return res.status(status).json(payload);
  }

  static paginated<T>(res: Response, data: PaginatedData<T>, message: string = 'Success', status: number = 200, meta?: Record<string, any>) {
    return this.success(res, data, message, status, meta);
  }

  static error(res: Response, message: string, status: number = 500, code: string = 'ERROR', details?: any, stack?: string) {
    const payload: IApiResponse<null> = {
      success: false,
      message,
      data: null,
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId,
      error: {
        code,
        details,
      },
    };
    
    // Only include stack in development
    if (process.env.NODE_ENV === 'development' && stack && payload.error) {
      payload.error.stack = stack;
    }

    return res.status(status).json(payload);
  }
}
