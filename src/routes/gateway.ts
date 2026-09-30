import { Router } from 'express';
import authRouter from '@/routes/auth/auth';
import userRouter from '@/routes/user/user';

const gateway = Router();

gateway.use('/auth', authRouter);
gateway.use('/users', userRouter)

export default gateway;