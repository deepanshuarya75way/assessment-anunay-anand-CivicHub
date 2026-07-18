import { QueueManager } from './queue.manager';
import { DomainEvent, EventTopic } from './event.types';
import crypto from 'crypto';

export class EventBus {
  // We use a single main event queue, and workers can route it. 
  // Alternatively, each topic could have its own queue.
  private static readonly MAIN_EXCHANGE = 'civichub-events';

  static async publish<T>(topic: EventTopic, payload: T): Promise<void> {
    const queue = QueueManager.getQueue(this.MAIN_EXCHANGE);
    const event: DomainEvent<T> = {
      id: crypto.randomUUID(),
      topic,
      timestamp: new Date(),
      payload,
    };
    
    await queue.add(topic, event, {
      removeOnComplete: true,
      removeOnFail: 1000, // keep some history of failed jobs
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }
}
