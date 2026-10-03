import { db } from '@/../prisma/db';
import type { Models } from '@/../prisma/schema.d';

type NotificationId = Models.public_Notification['id'];
const asNotificationId = (id: string) => id as NotificationId;

export const create = (data: {
  id: string;
  userId: string;
  message: string;
  relatedPostId?: string;
}) => db.orm.public.Notification.create({
  id: asNotificationId(data.id),
  userId: data.userId as Models.public_Notification['userId'],
  message: data.message,
  isRead: false,
  relatedPostId: data.relatedPostId
    ? (data.relatedPostId as Models.public_Notification['relatedPostId'])
    : null,
});