import { HashtagService } from '../services/hashtag.service';
import { DomainEvent } from '../../../core/events/event.types';

export class DiscoveryWorker {
  static async handleEvent(event: DomainEvent<any>) {
    switch (event.topic) {
      case 'community.post.created':
        await this.handlePostCreated(event.payload);
        break;
      // Depending on the event, we can adjust trending scores, e.g., 'community.comment.created'
      // to update the post's trending score if we stored it separately.
      default:
        break;
    }
  }

  private static async handlePostCreated(payload: any) {
    if (payload.hashtags && Array.isArray(payload.hashtags)) {
      for (const tag of payload.hashtags) {
        await HashtagService.recordUsage(tag);
      }
    }
  }
}
