import { Router } from 'express';
import { volunteerController } from './volunteer.controller';
import { authenticate } from '../../core/middlewares/auth.middleware';

const router = Router();

// Require auth for all volunteer routes
router.use(authenticate);

// Profiles
router.get('/profiles/:userId', volunteerController.getProfile);
router.put('/profiles/:userId', volunteerController.updateProfile);

// Campaigns
router.get('/campaigns', volunteerController.getCampaigns);
router.post('/campaigns', volunteerController.createCampaign);
router.get('/campaigns/:id', volunteerController.getCampaign);

// Tasks
router.get('/campaigns/:id/tasks', volunteerController.getCampaignTasks);
router.post('/campaigns/:id/tasks', volunteerController.createCampaignTask);
router.post('/tasks/:taskId/assign', volunteerController.assignTask);

// Registrations
router.get('/campaigns/:id/registrations', volunteerController.getCampaignRegistrations);
router.post('/campaigns/:id/join', volunteerController.joinCampaign);

export const volunteerRoutes: Router = router;
