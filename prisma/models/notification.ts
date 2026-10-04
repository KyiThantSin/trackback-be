import { defineContract } from '@prisma/orm-postgres/contract-builder';

type ContractHelpers = Parameters<typeof defineContract>[1] extends (
  helpers: infer Helpers,
) => unknown
  ? Helpers
  : never;

export const defineNotificationModel = (
  field: ContractHelpers['field'],
  model: ContractHelpers['model'],
) =>
  model('Notification', {
    fields: {
      id: field.id.uuidv7String(),
      userId: field.uuidString(),
      message: field.text(),
      isRead: field.boolean(),
      relatedItemId: field.uuidString().optional(),
      createdAt: field.temporal.createdAtString(),
    },
  });