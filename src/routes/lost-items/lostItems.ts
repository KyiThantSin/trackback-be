import { Router } from 'express';
import * as lostItemsController from '@/controllers/lost-items/lostItemsController';
import { secureRoute } from '@/middlewares/secure-route';

const router = Router();

router.get('/', lostItemsController.getLostItems);
router.get('/:id', lostItemsController.getLostItemById);
router.post('/', secureRoute, lostItemsController.createLostItem);

export default router;
