import { Router } from "express";
import * as authController from '@/controllers/auth/auth';

const router = Router();

router.get('/login', authController.login);

export default router;