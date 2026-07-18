import { Router } from 'express';
import { authRoutes } from '../../domains/auth/auth.routes';
import { healthRoutes } from '../../domains/health/health.routes';
import { communityRoutes } from '../../domains/community/community.routes';
import { identityRoutes } from '../../domains/identity/identity.routes';
import { communitiesRoutes } from '../../domains/communities/communities.routes';
import { organizationsRoutes } from '../../domains/organizations/organizations.routes';
import { discoveryRoutes } from '../../domains/discovery/discovery.routes';
import { civicRoutes } from '../../domains/civic/civic.routes';
import { volunteerRoutes } from '../../domains/volunteer/volunteer.routes';
import { eventsRouter } from '../../domains/events/events.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/health', healthRoutes);
router.use('/community', communityRoutes);
router.use('/identity', identityRoutes);
router.use('/communities', communitiesRoutes);
router.use('/organizations', organizationsRoutes);
router.use('/discovery', discoveryRoutes);
router.use('/civic', civicRoutes);
router.use('/volunteer', volunteerRoutes);
router.use('/events', eventsRouter);

export const v1Routes: Router = router;
