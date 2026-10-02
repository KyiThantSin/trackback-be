import jwt from 'jsonwebtoken';
import { BadRequestError, AuthenticationError } from '@/utils/errors';
import { type NextFunction, type Request, type Response } from 'express';
import * as lostItemService from '@/services/lost-items/lostItems';
import type { LostItemStatus } from '@/types/lostItem';

const getLostItemById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itemId = req.params.id;

    if (typeof itemId !== 'string' || itemId.length === 0) {
      throw new BadRequestError('Lost item ID is required');
    }

    const response = await lostItemService.getLostItemById(itemId);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const getLostItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const getTextQuery = (name: string): string | undefined => {
      const value = req.query[name];

      if (value === undefined) return undefined;
      if (typeof value !== 'string') {
        throw new BadRequestError(`${name} must be a single value`);
      }

      return value.trim();
    };

    const getPositiveIntegerQuery = (name: string, defaultValue: number): number => {
      const value = getTextQuery(name);
      if (value === undefined) return defaultValue;

      const parsed = Number(value);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new BadRequestError(`${name} must be a positive integer`);
      }

      return parsed;
    };

    const keyword = getTextQuery('keyword');
    const category = getTextQuery('category');
    const location = getTextQuery('location');
    const dateFrom = getTextQuery('dateFrom');
    const dateTo = getTextQuery('dateTo');
    const rawStatus = getTextQuery('status');
    const page = getPositiveIntegerQuery('page', 1);
    const limit = getPositiveIntegerQuery('limit', 10);

    if (limit > 100) {
      throw new BadRequestError('limit must not exceed 100');
    }

    if (dateFrom && Number.isNaN(Date.parse(dateFrom))) {
      throw new BadRequestError('dateFrom must be a valid date');
    }
    if (dateTo && Number.isNaN(Date.parse(dateTo))) {
      throw new BadRequestError('dateTo must be a valid date');
    }
    if (dateFrom && dateTo && Date.parse(dateFrom) > Date.parse(dateTo)) {
      throw new BadRequestError('dateFrom must be earlier than or equal to dateTo');
    }

    if (rawStatus && !['OPEN', 'RECOVERED', 'CLOSED'].includes(rawStatus)) {
      throw new BadRequestError('status must be OPEN, RECOVERED, or CLOSED');
    }

    const response = await lostItemService.listLostItems({
      keyword,
      category,
      location,
      dateFrom,
      dateTo,
      status: rawStatus as LostItemStatus | undefined,
      page,
      limit,
    });

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const createLostItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    const accessSecret = process.env.ACCESS_TOKEN_SECRET;

    if (!token) {
      throw new AuthenticationError('Authentication required');
    }

    if (!accessSecret) {
      throw new Error('ACCESS_TOKEN_SECRET is not configured');
    }

    const payload = jwt.verify(token, accessSecret);

    if (
      typeof payload !== 'object' ||
      typeof payload.userId !== 'string' ||
      payload.userId.length === 0
    ) {
      throw new AuthenticationError('Invalid access token');
    }

    const { title, description, category, lastSeenLocation, lastSeenDate, photoUrl } = req.body;

    if (
      typeof title !== 'string' || title.trim().length === 0 ||
      typeof description !== 'string' || description.trim().length === 0 ||
      typeof category !== 'string' || category.trim().length === 0 ||
      typeof lastSeenLocation !== 'string' || lastSeenLocation.trim().length === 0 ||
      typeof lastSeenDate !== 'string' || lastSeenDate.trim().length === 0
    ) {
      throw new BadRequestError('Title, description, category, last seen location, and last seen date are required');
    }

    const response = await lostItemService.createLostItem({
      title,
      description,
      category,
      lastSeenLocation,
      lastSeenDate,
      photoUrl,
      userId: payload.userId,
    });

    return res.status(201).json({
      data: response,
      message: 'Lost item reported successfully',
    });
  } catch (error) {
    return next(error);
  }
};

export { createLostItem, getLostItemById, getLostItems };
