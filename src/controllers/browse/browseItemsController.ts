import { BadRequestError } from '@/errors/http-errors';
import type { NextFunction, Request, Response } from 'express';
import * as browseItemsService from '@/services/browse/browseItems';
import type { BrowseItemType } from '@/types/browseItem';

const getTextQuery = (req: Request, name: string): string | undefined => {
  const value = req.query[name];

  if (value === undefined) return undefined;
  if (typeof value !== 'string') {
    throw new BadRequestError(`${name} must be a single value`);
  }

  return value.trim();
};

const getPositiveIntegerQuery = (
  req: Request,
  name: string,
  defaultValue: number,
): number => {
  const value = getTextQuery(req, name);
  if (value === undefined) return defaultValue;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new BadRequestError(`${name} must be a positive integer`);
  }

  return parsed;
};

const getBrowseItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dateFrom = getTextQuery(req, 'dateFrom');
    const dateTo = getTextQuery(req, 'dateTo');
    const type = getTextQuery(req, 'type');
    const page = getPositiveIntegerQuery(req, 'page', 1);
    const limit = getPositiveIntegerQuery(req, 'limit', 10);

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
    if (type && !['lost', 'found', 'all'].includes(type)) {
      throw new BadRequestError('type must be lost, found, or all');
    }

    const response = await browseItemsService.browseItems({
      keyword: getTextQuery(req, 'keyword'),
      category: getTextQuery(req, 'category'),
      location: getTextQuery(req, 'location'),
      dateFrom,
      dateTo,
      type: type as BrowseItemType | undefined,
      page,
      limit,
    });

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

export { getBrowseItems };
