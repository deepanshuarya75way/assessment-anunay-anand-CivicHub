import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import { requestLogger } from './core/middlewares/requestLogger';
import { errorHandler } from './core/middlewares/errorHandler';
import { apiLimiter, mongoSanitizeMiddleware, xssMiddleware } from './core/middlewares/security.middleware';
import { requestIdMiddleware } from './core/middlewares/requestId.middleware';
import { swaggerSpec } from './core/config/swagger';

import { v1Routes } from './routes/v1';
import { healthRoutes } from './domains/health/health.routes';
import { governmentRoutes } from './domains/government/government.routes';

const app: express.Application = express();

// Core middlewares
app.use(requestIdMiddleware);
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Vite default port
  credentials: true,
}));
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Security middlewares
app.use('/api', apiLimiter);
app.use(mongoSanitizeMiddleware);
app.use(xssMiddleware);

// Logging
app.use(requestLogger);

// API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/v1', v1Routes);
app.use('/api/v1/gov', governmentRoutes);
app.use('/health', healthRoutes); // Use the new health routes at root level as well

// Error Handling
app.use(errorHandler);

export { app };
