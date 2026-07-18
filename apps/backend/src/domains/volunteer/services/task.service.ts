import { TaskModel, ITaskDocument } from '../models/task.model';
import { Task, TaskStatus } from '@civichub/shared';
import { NotFoundError, ValidationError } from '../../../core/exceptions';
import { EventBus } from '../../../core/events/event.bus';
import { EventTopic } from '../../../core/events/event.types';
import { z } from 'zod';

export class TaskService {
  async createTask(campaignId: string, data: Partial<Task>): Promise<ITaskDocument> {
    const task = await TaskModel.create({
      ...data,
      campaignId,
      status: 'TODO'
    });
    
    await EventBus.publish(EventTopic.VOLUNTEER_TASK_CREATED, { taskId: task.id, campaignId });
    return task;
  }

  async getTask(taskId: string): Promise<ITaskDocument> {
    const task = await TaskModel.findById(taskId);
    if (!task) throw new NotFoundError('Task not found');
    return task;
  }

  async assignTask(taskId: string, userId: string): Promise<ITaskDocument> {
    const task = await this.getTask(taskId);
    
    if (task.assignees.length >= task.maxVolunteers) {
      throw new ValidationError('Task has reached maximum volunteers');
    }
    
    if (task.assignees.includes(userId)) {
      throw new ValidationError('User is already assigned to this task');
    }

    task.assignees.push(userId);
    if (!task.assignedAt) {
      task.assignedAt = new Date();
    }
    
    await task.save();
    await EventBus.publish(EventTopic.VOLUNTEER_TASK_UPDATED, { taskId, action: 'assigned', userId });
    
    return task;
  }

  async updateTaskStatus(taskId: string, status: z.infer<typeof TaskStatus>): Promise<ITaskDocument> {
    const task = await this.getTask(taskId);
    task.status = status;
    
    if (status === 'COMPLETED') {
      task.completedAt = new Date();
    }
    
    await task.save();
    await EventBus.publish(EventTopic.VOLUNTEER_TASK_UPDATED, { taskId, status });
    return task;
  }

  async getCampaignTasks(campaignId: string): Promise<ITaskDocument[]> {
    return TaskModel.find({ campaignId }).sort({ priority: 1, createdAt: -1 });
  }
}

export const taskService = new TaskService();
