import type { NextFunction, Request, Response } from 'express';
import * as notificationService from '@/services/notifications/notifications';
import { BadRequestError, AuthenticationError } from '@/utils/errors';

const currentUserId = (req: Request) => {
  if (!req.userId) {
    throw new AuthenticationError('Authentication required');
  }
  return req.userId;
};

const pathParam = (value: string | string[] | undefined, name: string) => {
  if (typeof value !== 'string' || value.length === 0) {
    throw new BadRequestError(`${name} is required`);
  }
  return value;
};

const positiveInt = (value: unknown, name: string, fallback: number, max?: number) => {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || (max !== undefined && parsed > max)) {
    throw new BadRequestError(`${name} is invalid`);
  }
  return parsed;
};

const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await notificationService.getUserNotifications(
      currentUserId(req),
      positiveInt(req.query.page, 'page', 1),
      positiveInt(req.query.limit, 'limit', 20, 100),
    );
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const markNotificationAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await notificationService.markAsRead(
      pathParam(req.params.id, 'Notification ID'),
      currentUserId(req),
    );
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const markAllNotificationsAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await notificationService.markAllAsRead(currentUserId(req));
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export { getNotifications, markAllNotificationsAsRead, markNotificationAsRead };