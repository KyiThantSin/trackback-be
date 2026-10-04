import { Router } from 'express';
import * as matchingController from '@/controllers/matching/matchingController';
import { secureRoute } from '@/middlewares/secure-route';

const router = Router();

router.post('/matching/run/:itemId', secureRoute, matchingController.runMatching);
router.get('/lost-items/:id/matches', secureRoute, matchingController.getLostItemMatches);
router.get('/found-items/:id/matches', secureRoute, matchingController.getFoundItemMatches);

export default router;