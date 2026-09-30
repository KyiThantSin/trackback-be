import { Router } from 'express';
import * as lostItemsController from '@/controllers/lost-items/lostItemsController';
import { secureRoute } from '@/middlewares/secure-route';

const router = Router();

router.post('/', secureRoute, lostItemsController.createLostItem);

export default router;
