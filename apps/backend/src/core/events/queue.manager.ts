import { Queue, Worker, QueueEvents } from 'bullmq';
import { redis } from '../config/redis';
import { logger } from '../logging/logger';

export class QueueManager {
  private static queues: Map<string, Queue> = new Map();
  private static workers: Map<string, Worker> = new Map();

  static getQueue(queueName: string): Queue {
    if (!this.queues.has(queueName)) {
      const queue = new Queue(queueName, { connection: redis as any });
      this.queues.set(queueName, queue);
      logger.info(`[QueueManager] Initialized queue: ${queueName}`);
    }
    return this.queues.get(queueName)!;
  }

  static registerWorker(queueName: string, processor: (job: any) => Promise<void>, concurrency: number = 5) {
    if (this.workers.has(queueName)) {
      logger.warn(`[QueueManager] Worker for ${queueName} is already registered.`);
      return;
    }

    const worker = new Worker(queueName, processor, {
      connection: redis as any,
      concurrency,
    });

    worker.on('completed', (job) => {
      logger.debug(`[QueueManager] Job ${job.id} completed in ${queueName}`);
    });

    worker.on('failed', (job, err) => {
      logger.error(`[QueueManager] Job ${job?.id} failed in ${queueName}: ${err.message}`);
    });

    this.workers.set(queueName, worker);
    logger.info(`[QueueManager] Registered worker for queue: ${queueName}`);
  }

  static async shutdown() {
    for (const [name, worker] of Array.from(this.workers.entries())) {
      await worker.close();
      logger.info(`[QueueManager] Closed worker for ${name}`);
    }
    for (const [name, queue] of Array.from(this.queues.entries())) {
      await queue.close();
      logger.info(`[QueueManager] Closed queue for ${name}`);
    }
  }
}
