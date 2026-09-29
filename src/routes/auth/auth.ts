import { Router } from "express";
import * as authController from '@/controllers/auth/auth';

const router = Router();

// chain of responsibility pattern
router.post('/login', authController.login);


export default router;