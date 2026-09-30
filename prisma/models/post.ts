import { defineContract } from '@prisma/orm-postgres/contract-builder';

type ContractHelpers = Parameters<typeof defineContract>[1] extends (
  helpers: infer Helpers,
) => unknown
  ? Helpers
  : never;

export const definePostModel = (
  field: ContractHelpers['field'],
  model: ContractHelpers['model'],
) =>
  model('Post', {
    fields: {
      id: field.id.uuidv7String(),
      title: field.text(),
      content: field.text().optional(),
      authorId: field.uuidString(),
      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAtString(),
    },
  });
