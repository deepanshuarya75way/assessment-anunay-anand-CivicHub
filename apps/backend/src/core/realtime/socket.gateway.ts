import { Server as SocketIOServer } from 'socket.io';
import { QueueManager } from '../events/queue.manager';
import { EventTopic, DomainEvent } from '../events/event.types';
import { SocketRooms } from './socket.rooms';
import { SocketEvents } from './socket.events';
import { logger } from '../logging/logger';
import { Job } from 'bullmq';

export class SocketGateway {
  private io: SocketIOServer;
  
  constructor(io: SocketIOServer) {
    this.io = io;
  }

  /**
   * Listens to the BullMQ event bus and forwards relevant events to Socket.IO clients.
   * Note: A better scalable approach would be using Redis Pub/Sub directly for Socket.io adapter,
   * but for mapping DomainEvents -> Socket events, this worker processes them.
   */
  startListening() {
    QueueManager.registerWorker('civichub-events', async (job: Job) => {
      const event: DomainEvent = job.data;
      
      switch (event.topic) {
        case EventTopic.COMMUNITY_POST_CREATED:
          // In a global feed, we might broadcast to a general room
          break;
        case EventTopic.COMMUNITY_COMMENT_CREATED:
          if (event.payload.postId) {
            this.io.to(SocketRooms.postRoom(event.payload.postId)).emit(SocketEvents.NEW_COMMENT, event.payload);
          }
          break;
        case EventTopic.COMMUNITY_REACTION_CREATED:
        case EventTopic.COMMUNITY_REACTION_UPDATED:
          if (event.payload.postId) {
            this.io.to(SocketRooms.postRoom(event.payload.postId)).emit(SocketEvents.NEW_REACTION, event.payload);
          }
          break;
      }
    }, 2);
    logger.info('[SocketGateway] Started listening for domain events to forward to sockets');
  }
}
