import { Router } from 'express';
import { CommunitiesController } from './communities.controller';
import { authenticate } from '../../core/middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/discover', CommunitiesController.discoverCommunities);
router.get('/:slug', CommunitiesController.getCommunity);

// Authenticated routes
router.use(authenticate);
router.post('/', CommunitiesController.createCommunity);
router.patch('/:id', CommunitiesController.updateCommunity);
router.post('/:id/join', CommunitiesController.joinCommunity);

export const communitiesRoutes: Router = router;
