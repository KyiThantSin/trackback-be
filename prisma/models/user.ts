import { defineContract } from '@prisma/orm-postgres/contract-builder';

type ContractHelpers = Parameters<typeof defineContract>[1] extends (
  helpers: infer Helpers,
) => unknown
  ? Helpers
  : never;

export const defineUserModel = (
  field: ContractHelpers['field'],
  model: ContractHelpers['model'],
) =>
  model('User', {
    fields: {
      id: field.id.uuidv7String(),
      email: field.text().unique(),
      name: field.text(),
      profileUrl: field.text().optional(),
      profilePublicId: field.text().optional(),
      about: field.text().optional(),
      password: field.text(),
      role: field.text(),
      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAtString(),
      deletedAt: field.temporal.timestamptzString().optional(),
    },
  });
