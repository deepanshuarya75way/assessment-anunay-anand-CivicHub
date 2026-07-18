import { QueueManager } from '../../../core/events/queue.manager';
import { issueClassifierService } from '../services/issue-classifier.service';
import { duplicateDetectorService } from '../services/duplicate.service';
import { departmentRouterService } from '../services/department-router.service';
import { DomainEvent, EventTopic } from '../../../core/events/event.types';

export class AIWorker {
  initialize() {
    QueueManager.registerWorker('ai-tasks', async (job) => {
      const { type, payload } = job.data;
      
      switch (type) {
        case 'PROCESS_NEW_ISSUE':
          await Promise.all([
            issueClassifierService.classifyIssue(payload.id, payload.title, payload.description),
            duplicateDetectorService.detectDuplicates(payload.id, payload.title, payload.description),
            departmentRouterService.routeIssue(payload.id, payload.title, payload.description, payload.category || 'General')
          ]);
          break;
          
        default:
          console.warn(`Unknown AI task type: ${type}`);
      }
    });
  }

  async handleDomainEvent(event: DomainEvent<any>) {
    const queue = QueueManager.getQueue('ai-tasks');
    
    if (event.topic === EventTopic.CIVIC_ISSUE_CREATED) {
      await queue.add('ai-job', {
        type: 'PROCESS_NEW_ISSUE',
        payload: event.payload
      });
    }
  }
}

export const aiWorker = new AIWorker();
