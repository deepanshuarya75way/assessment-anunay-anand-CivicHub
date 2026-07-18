import { QueueManager } from '../../../core/events/queue.manager';
import { logger } from '../../../core/logging/logger';
import { Job } from 'bullmq';
import * as cheerio from 'cheerio';
import { postRepository } from '../posts/post.repository';
import { AttachmentType } from '../posts/post.model';

// Use 'any' for link preview attachment since the base attachment model might not have title/description yet
// or we can just overload the Attachment model. For now we use the existing fields + some unstructured data if needed.

export class LinkPreviewWorker {
  static start() {
    QueueManager.registerWorker('civichub:link-preview-queue', async (job: Job) => {
      const { postId, urls } = job.data;
      if (!urls || urls.length === 0) return;

      logger.info(`[LinkPreview] Generating preview for post ${postId}`);
      const previews = [];

      for (const url of urls) {
        try {
          const response = await fetch(url);
          const html = await response.text();
          const $ = cheerio.load(html);

          const title = $('meta[property="og:title"]').attr('content') || $('title').text();
          const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content');
          const image = $('meta[property="og:image"]').attr('content');

          if (title || description || image) {
            previews.push({
              id: `lp_${Date.now()}_${Math.random().toString(36).substring(7)}`,
              type: 'DOCUMENT' as AttachmentType, // Or a new LINK_PREVIEW type
              url: url,
              thumbnailUrl: image || '',
              // Storing extra data in url or a new field if schema allows
              // In a real scenario we'd extend AttachmentSchema with title & description
            });
          }
        } catch (err) {
          logger.error(`[LinkPreview] Failed to fetch url ${url}`, err);
        }
      }

      if (previews.length > 0) {
        const post = await postRepository.findById(postId);
        if (post) {
          // Push new attachments
          post.attachments.push(...previews);
          await post.save();
          logger.info(`[LinkPreview] Saved previews to post ${postId}`);
        }
      }
    });
  }
}
