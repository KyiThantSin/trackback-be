import { Router } from 'express';
import authRouter from '@/routes/auth/auth';
import userRouter from '@/routes/user/user';
import claimsRouter from '@/routes/claims/claims';
import notificationsRouter from '@/routes/notifications/notifications';

const gateway = Router();

gateway.use('/auth', authRouter);
gateway.use('/users', userRouter)
gateway.use('/api/v1', claimsRouter);
gateway.use('/api/v1', notificationsRouter);

export default gateway;