import { Router } from 'express';
import * as notificationsController from '@/controllers/notifications/notificationsController';
import { secureRoute } from '@/middlewares/secure-route';

const router = Router();

router.get('/notifications', secureRoute, notificationsController.getNotifications);
router.patch('/notifications/:id/read', secureRoute, notificationsController.markNotificationAsRead);
router.patch('/notifications/read-all', secureRoute, notificationsController.markAllNotificationsAsRead);

export default router;