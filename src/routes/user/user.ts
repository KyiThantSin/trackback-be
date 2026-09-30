import { Router } from "express";
import * as userController from '@/controllers/users/usersController';
import { secureRoute } from '@/middlewares/secure-route';

const router = Router();

router.get('/:id', secureRoute, userController.getUser)
router.put('/:id', secureRoute, userController.updateUser)
router.patch('/:id', secureRoute, userController.updateUser)

export default router;