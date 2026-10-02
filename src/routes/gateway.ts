import { Router } from 'express';
import authRouter from '@/routes/auth/auth';
import userRouter from '@/routes/user/user';
import claimsRouter from '@/routes/claims/claims';

const gateway = Router();

gateway.use('/auth', authRouter);
gateway.use('/users', userRouter)
gateway.use('/api/v1', claimsRouter);

export default gateway;