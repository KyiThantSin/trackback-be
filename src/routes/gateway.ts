import { Router } from 'express';
import authRouter from '@/routes/auth/auth';
import userRouter from '@/routes/user/user';
import claimsRouter from '@/routes/claims/claims';
import foundItemsRouter from '@/routes/found-items/foundItems';
import lostItemsRouter from '@/routes/lost-items/lostItems';
import notificationsRouter from '@/routes/notifications/notifications';
import mediaRouter from '@/routes/media/media';
import matchingRouter from '@/routes/matching/matching';
import browseItemRouter from '@/routes/browse/browseItems';
import myPostsRouter from '@/routes/my-posts/myPosts';

const gateway = Router();

gateway.use('/auth', authRouter);
gateway.use('/users', userRouter);
gateway.use('/', claimsRouter);
gateway.use('/found-items', foundItemsRouter);
gateway.use('/lost-items', lostItemsRouter);
gateway.use('/', notificationsRouter);
gateway.use('/media', mediaRouter);
gateway.use('/', matchingRouter);
gateway.use('/items', browseItemRouter);
gateway.use('/my-posts', myPostsRouter);

export default gateway;