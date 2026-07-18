import { Router } from 'express';
import { governmentController } from './government.controller';
import { authenticate, requireRole } from '../../core/middlewares/auth.middleware';
import { Role } from '@civichub/shared';

const router = Router();

router.use(authenticate);
router.use(requireRole([
  Role.SUPER_ADMIN,
  Role.GOV_ADMIN,
  Role.DEPT_HEAD,
  Role.SUPERVISOR,
  Role.OFFICER,
  Role.INSPECTOR
]));

// Government Workspace Routes
router.get('/workspace', governmentController.getMyWorkspace.bind(governmentController));
router.get('/analytics', governmentController.getDashboardAnalytics.bind(governmentController));

export const governmentRoutes: Router = router;
