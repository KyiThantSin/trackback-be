import jwt from 'jsonwebtoken';
import { BadRequestError, AuthenticationError } from '@/errors/http-errors';
import { type NextFunction, type Request, type Response } from 'express';
import * as foundItemService from '@/services/found-items/foundItems';
import type { FoundItemStatus, UpdateFoundItemPayload } from '@/types/foundItem';

const getFoundItems = async (req: Request, res: Response, next: NextFunction) => {
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

    const statuses: FoundItemStatus[] = ['OPEN', 'PENDING_CLAIM', 'CLAIMED', 'CLOSED'];
    if (rawStatus && !statuses.includes(rawStatus as FoundItemStatus)) {
      throw new BadRequestError('status must be OPEN, PENDING_CLAIM, CLAIMED, or CLOSED');
    }

    const response = await foundItemService.listFoundItems({
      keyword,
      category,
      location,
      dateFrom,
      dateTo,
      status: rawStatus as FoundItemStatus | undefined,
      page,
      limit,
    });

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const getFoundItemById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itemId = req.params.id;
    if (typeof itemId !== 'string' || itemId.length === 0) {
      throw new BadRequestError('Found item ID is required');
    }

    const response = await foundItemService.getFoundItemById(itemId);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const updateFoundItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itemId = req.params.id;
    if (typeof itemId !== 'string' || itemId.length === 0) {
      throw new BadRequestError('Found item ID is required');
    }

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

    const body = req.body ?? {};
    const updates: UpdateFoundItemPayload = {};
    const getOptionalText = (value: unknown, name: string): string | undefined => {
      if (value === undefined) return undefined;
      if (typeof value !== 'string' || value.trim().length === 0) {
        throw new BadRequestError(`${name} must be a non-empty string`);
      }
      return value.trim();
    };

    const title = getOptionalText(body.title, 'title');
    const description = getOptionalText(body.description, 'description');
    const category = getOptionalText(body.category, 'category');
    const foundLocation = getOptionalText(body.foundLocation, 'foundLocation');

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (foundLocation !== undefined) updates.foundLocation = foundLocation;

    if (body.foundDate !== undefined) {
      const foundDate = getOptionalText(body.foundDate, 'foundDate');
      if (foundDate && Number.isNaN(Date.parse(foundDate))) {
        throw new BadRequestError('foundDate must be a valid date');
      }
      if (foundDate) updates.foundDate = new Date(foundDate).toISOString();
    }

    if (body.photoUrl !== undefined) {
      if (
        body.photoUrl !== null &&
        (typeof body.photoUrl !== 'string' || body.photoUrl.trim().length === 0)
      ) {
        throw new BadRequestError('photoUrl must be a non-empty string or null');
      }
      updates.photoUrl = typeof body.photoUrl === 'string' ? body.photoUrl.trim() : null;
    }

    if (Object.keys(updates).length === 0) {
      throw new BadRequestError('At least one field must be provided');
    }

    const response = await foundItemService.updateFoundItem(itemId, payload.userId, updates);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const createFoundItem = async (req: Request, res: Response, next: NextFunction) => {
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

    const {
      title,
      description,
      category,
      foundLocation,
      foundDate,
      photoUrl,
    } = req.body ?? {};

    if (
      typeof title !== 'string' || title.trim().length === 0 ||
      typeof description !== 'string' || description.trim().length === 0 ||
      typeof category !== 'string' || category.trim().length === 0 ||
      typeof foundLocation !== 'string' || foundLocation.trim().length === 0 ||
      typeof foundDate !== 'string' || foundDate.trim().length === 0
    ) {
      throw new BadRequestError(
        'Title, description, category, found location, and found date are required',
      );
    }

    if (Number.isNaN(Date.parse(foundDate))) {
      throw new BadRequestError('foundDate must be a valid date');
    }
    if (
      photoUrl !== undefined && photoUrl !== null &&
      (typeof photoUrl !== 'string' || photoUrl.trim().length === 0)
    ) {
      throw new BadRequestError('photoUrl must be a non-empty string or null');
    }

    const response = await foundItemService.createFoundItem({
      title,
      description,
      category,
      foundLocation,
      foundDate: new Date(foundDate).toISOString(),
      photoUrl,
      userId: payload.userId,
    });

    return res.status(201).json({
      data: response,
      message: 'Found item reported successfully',
    });
  } catch (error) {
    return next(error);
  }
};

export { createFoundItem, getFoundItemById, getFoundItems, updateFoundItem };