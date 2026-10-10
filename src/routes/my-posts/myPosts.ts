import { Router } from 'express';
import * as myPostsController from '@/controllers/my-posts/myPostsController';
import { secureRoute } from '@/middlewares/secure-route';

const router = Router();

router.get('/', secureRoute, myPostsController.getMyPosts);

export default router;
