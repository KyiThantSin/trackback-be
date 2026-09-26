import { Router } from 'express';
import authRouter from '@/routes/auth/auth';

const gateway = Router();

gateway.use('/auth', authRouter);

export default gateway;