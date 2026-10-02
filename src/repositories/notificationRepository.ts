import { db } from '@/../prisma/db';
import type { Models } from '@/../prisma/schema.d';

type NotificationId = Models.public_Notification['id'];
const asNotificationId = (id: string) => id as NotificationId;

export const create = (data: {
  id: string;
  userId: string;
  type: string;
  message: string;
  referenceId?: string;
}) => db.orm.public.Notification.create({
  ...data,
  id: asNotificationId(data.id),
  userId: data.userId as Models.public_Notification['userId'],
  referenceId: data.referenceId
    ? (data.referenceId as Models.public_Notification['referenceId'])
    : null,
});