import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticate } from '../../core/middlewares/auth.middleware';

const router = Router();

router.post('/register', AuthController.register);
router.post('/verify-email', AuthController.verifyEmail);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);
router.post('/logout-all', authenticate, AuthController.logoutAllDevices);

export const authRoutes: Router = router;
