import { randomUUID } from 'node:crypto';
import * as notificationRepository from '@/repositories/notificationRepository';
import type { NotificationResponse, NotificationsListResponse } from '@/types/notification';
import { ClaimError, ForbiddenError } from '@/errors/http-errors';

const toNotificationResponse = (notification: NotificationResponse): NotificationResponse => ({
  id: notification.id,
  message: notification.message,
  isRead: notification.isRead,
  createdAt: notification.createdAt,
  userId: notification.userId,
  relatedItemId: notification.relatedItemId,
  relatedClaimId: notification.relatedClaimId,
});

const notifyUser = async (
  userId: string,
  message: string,
  relatedItemId?: string,
  relatedClaimId?: string,
) =>
  notificationRepository.create({
    id: randomUUID(),
    userId,
    message,
    relatedItemId,
    relatedClaimId,
  });

const getUserNotifications = async (
  userId: string,
  page: number,
  limit: number,
): Promise<NotificationsListResponse> => {
  const [items, count, unread] = await Promise.all([
    notificationRepository.findByUser(userId, page, limit),
    notificationRepository.countByUser(userId),
    notificationRepository.countUnreadByUser(userId),
  ]);

  return {
    items: items.map(toNotificationResponse),
    page,
    limit,
    total: count.total,
    unreadCount: unread.total,
  };
};

const markAsRead = async (notificationId: string, userId: string) => {
  const notification = await notificationRepository.findById(notificationId);
  if (!notification) {
    throw new ClaimError(404, 'NOTIFICATION_NOT_FOUND', 'Notification not found');
  }
  if (notification.userId !== userId) {
    throw new ForbiddenError('You are not authorized to modify this notification');
  }

  const updated = await notificationRepository.markAsRead(notificationId, userId);
  return {
    id: updated?.id ?? notification.id,
    isRead: true,
  };
};

const markAllAsRead = async (userId: string) => ({
  updatedCount: await notificationRepository.markAllAsRead(userId),
});

export { getUserNotifications, markAllAsRead, markAsRead, notifyUser };