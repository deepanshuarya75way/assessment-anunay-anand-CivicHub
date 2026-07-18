import { Router } from 'express';
import { DiscoveryController } from './discovery.controller';

const router = Router();

// These routes can be public or partially protected depending on requirements.
// For now, keeping them public to allow anonymous discovery, with optional auth context.
router.get('/search', DiscoveryController.search);
router.get('/trending', DiscoveryController.getTrending);
router.get('/hashtags', DiscoveryController.getPopularHashtags);
router.get('/hashtags/:tag', DiscoveryController.getHashtag);

export const discoveryRoutes: Router = router;
