import { app } from './app';
import { env } from './core/config/env';
import { connectDB } from './core/db/mongoose';
import { logger } from './core/logging/logger';

import http from 'http';
import { initializeRealtime } from './core/realtime/socket.server';

const server = http.createServer(app);
initializeRealtime(server);

import { QueueManager } from './core/events/queue.manager';
import { DiscoveryWorker } from './domains/discovery/workers/discovery.worker';
import { aiWorker } from './domains/ai/jobs/ai.worker';
import { analyticsPipeline } from './domains/government/jobs/analytics.worker';

const startServer = async () => {
  try {
    await connectDB();
    
    // Initialize AI worker (registers 'ai-tasks' queue)
    aiWorker.initialize();
    
    // Initialize Analytics Pipeline
    analyticsPipeline.initialize();

    // Register event workers
    QueueManager.registerWorker('civichub-events', async (job) => {
      await Promise.all([
        DiscoveryWorker.handleEvent(job.data),
        aiWorker.handleDomainEvent(job.data),
        analyticsPipeline.handleDomainEvent(job.data)
      ]);
    });
    server.listen(env.PORT, () => {
      logger.info(`Server listening on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
