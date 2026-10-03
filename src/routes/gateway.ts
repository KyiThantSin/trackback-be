import { Router } from 'express';
import authRouter from '@/routes/auth/auth';
import userRouter from '@/routes/user/user';
import lostItemsRouter from '@/routes/lost-items/lostItems';
import uploadRouter from '@/routes/media/media';

const gateway = Router();

gateway.use('/auth', authRouter);
gateway.use('/users', userRouter);
gateway.use('/lost-items', lostItemsRouter);
gateway.use('/media', uploadRouter);

export default gateway;