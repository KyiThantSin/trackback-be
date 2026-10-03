import { Router } from "express";
import * as authController from '@/controllers/auth/authController';

const router = Router();

// chain of responsibility pattern
router.post('/login', authController.login);
router.post('/register', authController.register);
router.delete('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)


export default router;