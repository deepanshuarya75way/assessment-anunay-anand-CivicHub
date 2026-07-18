import { Router } from 'express';
import { PostController } from './posts/post.controller';
import { FeedController } from './feed/feed.controller';
import { MediaController } from './media/media.controller';
import { CommentController } from './comments/comment.controller';
import { ReactionController } from './reactions/reaction.controller';
import { BookmarkController } from './bookmarks/bookmark.controller';
import { authenticate } from '../../core/middlewares/auth.middleware';

const router = Router();

// Feed
router.get('/feed', authenticate, FeedController.getFeed);

// Posts
router.post('/posts', authenticate, PostController.create);
router.patch('/posts/:id', authenticate, PostController.update);
router.delete('/posts/:id', authenticate, PostController.delete);

// Comments
router.post('/posts/:targetId/comments', authenticate, CommentController.create);
router.get('/posts/:targetId/comments', authenticate, CommentController.getComments);
router.get('/comments/:commentId/replies', authenticate, CommentController.getReplies);
router.patch('/comments/:commentId', authenticate, CommentController.update);
router.delete('/comments/:commentId', authenticate, CommentController.delete);

// Reactions
router.post('/posts/:postId/reactions', authenticate, ReactionController.toggle);

// Bookmarks
router.post('/posts/:postId/bookmarks', authenticate, BookmarkController.toggle);
router.get('/me/bookmarks', authenticate, BookmarkController.getMyBookmarks);

// Media
router.post('/media/upload-token', authenticate, MediaController.generateUploadToken);

export const communityRoutes: Router = router;
