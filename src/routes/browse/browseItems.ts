import { Router } from 'express';
import * as browseItemsController from '@/controllers/browse/browseItemsController';
import { secureRoute } from '@/middlewares/secure-route';

const router = Router();

router.get('/search', secureRoute, browseItemsController.getBrowseItems);

export default router;
