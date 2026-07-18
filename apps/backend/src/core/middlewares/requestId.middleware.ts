import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const reqId = req.headers['x-request-id'] || crypto.randomUUID();
  res.locals.requestId = reqId;
  res.setHeader('x-request-id', reqId);
  next();
};
