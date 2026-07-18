import { Request, Response, NextFunction } from 'express';
import { logger } from '../logging/logger';
import crypto from 'crypto';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const requestId = crypto.randomUUID();
  req.headers['x-request-id'] = requestId;
  
  logger.info(`Incoming Request: ${req.method} ${req.url}`, { requestId });
  
  res.on('finish', () => {
    logger.info(`Request Completed: ${req.method} ${req.url} - Status: ${res.statusCode}`, { requestId });
  });
  
  next();
};
