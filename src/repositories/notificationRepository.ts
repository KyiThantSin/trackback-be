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

export const findByUser = (userId: string, page: number, limit: number) =>
  db.orm.public.Notification
    .where({ userId: userId as Models.public_Notification['userId'] })
    .orderBy((notification) => notification.createdAt.desc())
    .offset((page - 1) * limit)
    .limit(limit)
    .all();

export const countByUser = (userId: string) =>
  db.orm.public.Notification
    .where({ userId: userId as Models.public_Notification['userId'] })
    .aggregate((aggregate) => ({ total: aggregate.count() }));

export const findByIdAndUser = (id: string, userId: string) =>
  db.orm.public.Notification.first({
    id: id as NotificationId,
    userId: userId as Models.public_Notification['userId'],
  });

export const findById = (id: string) =>
  db.orm.public.Notification.first({ id: id as NotificationId });

export const markAsRead = (id: string, userId: string) =>
  db.orm.public.Notification
    .where({
      id: id as NotificationId,
      userId: userId as Models.public_Notification['userId'],
    })
    .update({ isRead: true });

export const markAllAsRead = (userId: string) =>
  db.orm.public.Notification
    .where({
      userId: userId as Models.public_Notification['userId'],
      isRead: false,
    })
    .updateAndCount({ isRead: true });