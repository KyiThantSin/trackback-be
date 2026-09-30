import { Router } from 'express';
import authRouter from '@/routes/auth/auth';
import userRouter from '@/routes/user/user';
import lostItemsRouter from '@/routes/lost-items/lostItems';

const gateway = Router();

gateway.use('/auth', authRouter);
gateway.use('/users', userRouter);
gateway.use('/lost-items', lostItemsRouter);

export default gateway;