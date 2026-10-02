import { defineContract } from '@prisma/orm-postgres/contract-builder';

type ContractHelpers = Parameters<typeof defineContract>[1] extends (
  helpers: infer Helpers,
) => unknown
  ? Helpers
  : never;

export const defineClaimModel = (
  field: ContractHelpers['field'],
  model: ContractHelpers['model'],
) =>
  model('Claim', {
    fields: {
      id: field.id.uuidv7String(),
      status: field.text(),
      justification: field.text(),
      itemDetails: field.text(),
      proofPhotoUrl: field.text().optional(),
      foundItemPostId: field.uuidString(),
      claimantUserId: field.uuidString(),
      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAtString(),
    },
  });