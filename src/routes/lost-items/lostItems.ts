import { Router } from 'express';
import * as lostItemsController from '@/controllers/lost-items/lostItemsController';
import { secureRoute } from '@/middlewares/secure-route';

const router = Router();

router.get('/', secureRoute, lostItemsController.getLostItems);
router.get('/:id', secureRoute, lostItemsController.getLostItemById);
router.delete('/:id', secureRoute, lostItemsController.deleteLostItem);
router.patch('/:id', secureRoute, lostItemsController.updateLostItem);
router.patch('/:id/recover', secureRoute, lostItemsController.recoverLostItem);
router.post('/', secureRoute, lostItemsController.createLostItem);

export default router;
