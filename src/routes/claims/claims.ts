import { Router } from 'express';
import * as claimsController from '@/controllers/claims/claimsController';
import { secureRoute } from '@/middlewares/secure-route';

const router = Router();

router.post('/found-items/:id/claims', secureRoute, claimsController.submitClaim);
router.get('/claims', secureRoute, claimsController.getClaims);
router.get('/claims/:id', secureRoute, claimsController.getClaimById);
router.patch('/claims/:id/review', secureRoute, claimsController.reviewClaim);

export default router;