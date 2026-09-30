import { Router } from "express";
import * as authController from '@/controllers/auth/authController';

const router = Router();

// chain of responsibility pattern
router.post('/login', authController.login);
router.post('/register', authController.register);
router.delete('/logout', authController.logout);


export default router;