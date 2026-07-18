import { Router } from 'express';
import { civicController } from './controllers/civic.controller';
import { authenticate } from '../../core/middlewares/auth.middleware';

const router = Router();

// Reference Data
router.get('/departments', civicController.getDepartments);
router.get('/categories', civicController.getCategories);

// Issues
router.get('/issues', civicController.getIssues);
router.post('/issues', authenticate, civicController.createIssue);
router.get('/issues/:id', civicController.getIssueById);

// Issue Workflows & Interactions
router.post('/issues/:id/transition', authenticate, civicController.transitionState);
router.post('/issues/:id/watch', authenticate, civicController.watchIssue);
router.post('/issues/:id/unwatch', authenticate, civicController.unwatchIssue);
router.post('/issues/:id/support', authenticate, civicController.supportIssue);
router.post('/issues/:id/unsupport', authenticate, civicController.removeSupport);
router.post('/issues/:id/updates', authenticate, civicController.addCitizenUpdate);
router.post('/issues/:id/duplicate', authenticate, civicController.markAsDuplicate);
router.get('/issues/:id/feed', civicController.getUnifiedActivityFeed);

export const civicRoutes: Router = router;
