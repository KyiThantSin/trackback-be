import { defineContract } from '@prisma/orm-postgres/contract-builder';

type ContractHelpers = Parameters<typeof defineContract>[1] extends (
  helpers: infer Helpers,
) => unknown
  ? Helpers
  : never;

export const defineLostItemPostModel = (
  field: ContractHelpers['field'],
  model: ContractHelpers['model'],
) =>
  model('LostItemPost', {
    fields: {
      id: field.id.uuidv7String(),
      title: field.text(),
      description: field.text(),
      category: field.text(),
      lastSeenLocation: field.text(),
      lastSeenDate: field.text(),
      status: field.text(),
      photoUrl: field.text().optional(),
      userId: field.uuidString(),
      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAtString(),
    },
  });
