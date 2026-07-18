import { IssueModel, IIssueDocument } from '../models/issue.model';
import { DepartmentModel } from '../models/department.model';
import { CategoryModel } from '../models/category.model';
import { IssueSupportModel } from '../models/issue-support.model';
import { IssueWatcherModel } from '../models/issue-watcher.model';
import { DuplicateIssueModel } from '../models/duplicate-issue.model';
import { CommentModel } from '../../community/comments/comment.model';
import { Issue, IssueStatus, Attachment } from '@civichub/shared';
import { EventBus } from '../../../core/events/event.bus';
import { EventTopic } from '../../../core/events/event.types';
import { NotFoundError, ValidationError } from '../../../core/exceptions';
import { z } from 'zod';

export class CivicService {
  /**
   * Create a new civic issue
   */
  async createIssue(data: Partial<Issue>, reporterId: string): Promise<IIssueDocument> {
    const category = await CategoryModel.findById(data.categoryId);
    if (!category) throw new NotFoundError('Category not found');

    if (data.assignedDepartmentId) {
      const dept = await DepartmentModel.findById(data.assignedDepartmentId);
      if (!dept) throw new NotFoundError('Department not found');
    }

    const newIssue = new IssueModel({
      ...data,
      reporterId,
      currentStatus: 'reported',
      workflowHistory: [{
        status: 'reported',
        changedBy: reporterId,
        timestamp: new Date(),
        note: 'Issue reported'
      }]
    });

    await newIssue.save();

    // Auto-watch by reporter
    await IssueWatcherModel.create({ issueId: newIssue.id, userId: reporterId });

    await EventBus.publish(EventTopic.CIVIC_ISSUE_CREATED, {
      issueId: newIssue._id,
      reporterId,
      title: newIssue.title
    });

    return newIssue;
  }

  /**
   * Transition an issue's status
   */
  async transitionIssueState(issueId: string, newStatus: z.infer<typeof IssueStatus>, userId: string, note?: string): Promise<IIssueDocument> {
    const issue = await IssueModel.findById(issueId);
    if (!issue) throw new NotFoundError('Issue not found');

    if (issue.currentStatus === newStatus) {
      throw new ValidationError(`Issue is already in ${newStatus} state`);
    }

    issue.currentStatus = newStatus;
    issue.workflowHistory.push({
      status: newStatus,
      changedBy: userId,
      timestamp: new Date(),
      note
    });

    await issue.save();

    const topicMap: Record<string, EventTopic> = {
      'verified': EventTopic.CIVIC_ISSUE_VERIFIED,
      'assigned': EventTopic.CIVIC_ISSUE_ASSIGNED,
      'in_progress': EventTopic.CIVIC_ISSUE_IN_PROGRESS,
      'resolved': EventTopic.CIVIC_ISSUE_RESOLVED,
      'closed': EventTopic.CIVIC_ISSUE_CLOSED,
    };

    const topic = topicMap[newStatus] || EventTopic.CIVIC_ISSUE_UPDATED;
    
    await EventBus.publish(topic, {
      issueId: issue._id,
      userId,
      newStatus,
      note
    });

    return issue;
  }

  /**
   * Watch an issue
   */
  async watchIssue(issueId: string, userId: string): Promise<void> {
    const issue = await IssueModel.findById(issueId);
    if (!issue) throw new NotFoundError('Issue not found');

    await IssueWatcherModel.updateOne(
      { issueId, userId },
      { $setOnInsert: { issueId, userId } },
      { upsert: true }
    );
  }

  /**
   * Unwatch an issue
   */
  async unwatchIssue(issueId: string, userId: string): Promise<void> {
    await IssueWatcherModel.deleteOne({ issueId, userId });
  }

  /**
   * Support an issue
   */
  async supportIssue(issueId: string, userId: string): Promise<void> {
    const issue = await IssueModel.findById(issueId);
    if (!issue) throw new NotFoundError('Issue not found');

    const result = await IssueSupportModel.updateOne(
      { issueId, userId },
      { $setOnInsert: { issueId, userId } },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      await EventBus.publish(EventTopic.CIVIC_ISSUE_SUPPORTED, { issueId, userId });
    }
  }

  /**
   * Remove support for an issue
   */
  async removeSupport(issueId: string, userId: string): Promise<void> {
    await IssueSupportModel.deleteOne({ issueId, userId });
  }

  /**
   * Add a citizen update
   */
  async addCitizenUpdate(issueId: string, userId: string, text: string, attachments: Attachment[] = []): Promise<IIssueDocument> {
    const issue = await IssueModel.findById(issueId);
    if (!issue) throw new NotFoundError('Issue not found');

    if (issue.reporterId !== userId) {
      throw new ValidationError('Only the reporter can add citizen updates');
    }

    issue.citizenUpdates.push({
      text,
      attachments,
      createdAt: new Date()
    });

    await issue.save();

    await EventBus.publish(EventTopic.CIVIC_ISSUE_UPDATE_CREATED, { issueId, userId });
    return issue;
  }

  /**
   * Mark issue as duplicate
   */
  async markAsDuplicate(duplicateId: string, primaryId: string, moderatorId: string, reason?: string): Promise<IIssueDocument> {
    if (duplicateId === primaryId) {
      throw new ValidationError('Cannot mark issue as duplicate of itself');
    }

    const [duplicate, primary] = await Promise.all([
      IssueModel.findById(duplicateId),
      IssueModel.findById(primaryId)
    ]);

    if (!duplicate) throw new NotFoundError('Duplicate issue not found');
    if (!primary) throw new NotFoundError('Primary issue not found');

    // Create duplicate relation
    await DuplicateIssueModel.create({
      duplicateId,
      primaryId,
      reason,
      mergedBy: moderatorId
    });

    // Close the duplicate issue
    await this.transitionIssueState(duplicateId, 'closed', moderatorId, `Marked as duplicate of ${primaryId}. ${reason || ''}`);

    await EventBus.publish(EventTopic.CIVIC_ISSUE_DUPLICATE_MARKED, { duplicateId, primaryId, moderatorId });
    return duplicate;
  }

  /**
   * Get unified activity feed for an issue
   * Merges workflow history, citizen updates, official responses, and comments chronologically.
   */
  async getUnifiedActivityFeed(issueId: string): Promise<any[]> {
    const issue = await IssueModel.findById(issueId);
    if (!issue) throw new NotFoundError('Issue not found');

    const feed: any[] = [];

    // 1. Workflow History
    issue.workflowHistory.forEach(history => {
      feed.push({
        type: 'workflow',
        timestamp: history.timestamp,
        data: history
      });
    });

    // 2. Citizen Updates
    issue.citizenUpdates.forEach(update => {
      feed.push({
        type: 'update',
        timestamp: update.createdAt,
        data: update
      });
    });

    // 3. Comments & Official Responses
    // Using targetType 'issue'
    const comments = await CommentModel.find({ targetId: issueId, targetType: 'issue' }).sort({ createdAt: 1 });
    comments.forEach(comment => {
      feed.push({
        type: comment.isOfficial ? 'official_response' : 'comment',
        timestamp: comment.createdAt,
        data: comment
      });
    });

    // Sort all chronologically
    feed.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return feed;
  }
}

export const civicService = new CivicService();
