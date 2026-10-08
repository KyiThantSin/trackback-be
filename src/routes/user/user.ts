import { Router } from "express";
import * as userController from '@/controllers/users/usersController';
import { secureRoute } from '@/middlewares/secure-route';
import upload from '@/middlewares/upload';

const router = Router();

router.get('/me', secureRoute, userController.getUser);
router.get('/:id', secureRoute, userController.getUser);
router.patch('/me', secureRoute, upload.single('profileUrl'), userController.updateUser);

export default router;