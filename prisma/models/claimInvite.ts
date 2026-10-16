import { defineContract } from '@prisma/orm-postgres/contract-builder';

type ContractHelpers = Parameters<typeof defineContract>[1] extends (
  helpers: infer Helpers,
) => unknown
  ? Helpers
  : never;

export const defineClaimInviteModel = (
  field: ContractHelpers['field'],
  model: ContractHelpers['model'],
) =>
  model('ClaimInvite', {
    fields: {
      id: field.id.uuidv7String(),
      foundItemPostId: field.uuidString(),
      lostItemId: field.uuidString(),
      finderUserId: field.uuidString(),
      ownerUserId: field.uuidString(),
      createdAt: field.temporal.createdAtString(),
    },
  });
