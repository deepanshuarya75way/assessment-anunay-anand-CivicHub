import { Router } from 'express';
import { HealthController } from './health.controller';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Basic health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/', HealthController.getHealth);

/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Liveness check for orchestrators
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is live
 */
router.get('/live', HealthController.getLive);

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Readiness check (validates connections)
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is ready to accept traffic
 *       503:
 *         description: Service dependencies are down
 */
router.get('/ready', HealthController.getReady);

export const healthRoutes: Router = router;
