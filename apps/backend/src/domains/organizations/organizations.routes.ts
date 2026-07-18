import { Router } from 'express';
import { OrganizationsController } from './organizations.controller';
import { authenticate } from '../../core/middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/:slug', OrganizationsController.getOrganization);

// Authenticated routes
router.use(authenticate);
router.post('/', OrganizationsController.createOrganization);
router.patch('/:id', OrganizationsController.updateOrganization);

export const organizationsRoutes: Router = router;
