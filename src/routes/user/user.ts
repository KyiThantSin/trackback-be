import { Router } from "express";
import * as userController from '@/controllers/users/usersController';
import { secureRoute } from '@/middlewares/secure-route';

const router = Router();

router.get('/:id', secureRoute, userController.getUser)

export default router;