import { Router } from 'express';
import * as claimsController from '@/controllers/claims/claimsController';
import { secureRoute } from '@/middlewares/secure-route';
import upload from '@/middlewares/upload';

const router = Router();

router.post('/found-items/:id/claims', secureRoute, upload.single('proofPhoto'), claimsController.submitClaim);
router.post('/found-items/:id/claim-invites', secureRoute, claimsController.sendClaimInvite);
router.get('/claims', secureRoute, claimsController.getClaims);
router.get('/claims/:id', secureRoute, claimsController.getClaimById);
router.patch('/claims/:id/review', secureRoute, claimsController.reviewClaim);

export default router;
