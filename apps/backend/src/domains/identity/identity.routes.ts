import { Router } from 'express';
import { IdentityController } from './identity.controller';
import { authenticate } from '../../core/middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/profiles/check-username', IdentityController.checkUsername);
router.get('/profiles/:username', IdentityController.getProfileByUsername);
router.get('/profiles/:username/activity', IdentityController.getUserActivity);

// All subsequent routes require authentication
router.use(authenticate);

// Identity/User
router.get('/me', IdentityController.getMe);
router.patch('/me', IdentityController.updateMe);
router.delete('/me', IdentityController.deleteMe);

// Profile
router.get('/me/profile', IdentityController.getMyProfile);
router.patch('/me/profile', IdentityController.updateMyProfile);
router.patch('/me/username', IdentityController.updateUsername);

// Preferences
router.get('/me/preferences', IdentityController.getMyPreferences);
router.patch('/me/preferences', IdentityController.updateMyPreferences);

export const identityRoutes: Router = router;
