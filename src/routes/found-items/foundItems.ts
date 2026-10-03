import { Router } from 'express';
import * as foundItemsController from '@/controllers/found-items/foundItemsController';
import { secureRoute } from '@/middlewares/secure-route';

const router = Router();

router.get('/', secureRoute, foundItemsController.getFoundItems);
router.post('/', secureRoute, foundItemsController.createFoundItem);

export default router;