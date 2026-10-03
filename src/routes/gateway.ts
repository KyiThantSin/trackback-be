import { Router } from 'express';
import authRouter from '@/routes/auth/auth';
import userRouter from '@/routes/user/user';
import claimsRouter from '@/routes/claims/claims';
import lostItemsRouter from '@/routes/lost-items/lostItems';
import notificationsRouter from '@/routes/notifications/notifications';
import matchingRouter from '@/routes/matching/matching';

const gateway = Router();

gateway.use('/auth', authRouter);
gateway.use('/users', userRouter);
gateway.use('/api/v1', claimsRouter);
gateway.use('/lost-items', lostItemsRouter);
gateway.use('/api/v1', notificationsRouter);
gateway.use('/', matchingRouter);

export default gateway;