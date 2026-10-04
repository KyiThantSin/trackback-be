import { defineContract } from '@prisma/orm-postgres/contract-builder';

type ContractHelpers = Parameters<typeof defineContract>[1] extends (
  helpers: infer Helpers,
) => unknown
  ? Helpers
  : never;

export const defineFoundItemPostModel = (
  field: ContractHelpers['field'],
  model: ContractHelpers['model'],
) =>
  model('FoundItemPost', {
    fields: {
      id: field.id.uuidv7String(),
      title: field.text(),
      description: field.text(),
      category: field.text(),
      foundLocation: field.text(),
      foundDate: field.temporal.timestamptzString(),
      status: field.text(),
      photoUrl: field.text().optional(),
      userId: field.uuidString(),
      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAtString(),
    },
  });