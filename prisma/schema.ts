// example
import { defineContract } from '@prisma/orm-postgres/contract-builder';
import { defineClaimModel } from './models/claim.ts';
import { defineClaimInviteModel } from './models/claimInvite.ts';
import { defineFoundItemPostModel } from './models/foundItemPost.ts';
import { defineLostItemPostModel } from './models/lostItemPost.ts';
import { defineUserModel } from './models/user.ts';
import { defineNotificationModel } from './models/notification.ts';

export const contract = defineContract({}, ({ field, model, rel }) => {
  const User = defineUserModel(field, model);
  const Claim = defineClaimModel(field, model);
  const ClaimInvite = defineClaimInviteModel(field, model);
  const Notification = defineNotificationModel(field, model);
  const LostItemPost = defineLostItemPostModel(field, model);
  const FoundItemPost = defineFoundItemPostModel(field, model);

  return {
    models: {
      User: User.relations({
        claims: rel.hasMany(Claim, { by: 'claimantUserId' }),
        notifications: rel.hasMany(Notification, { by: 'userId' }),
        lostItems: rel.hasMany(LostItemPost, { by: 'userId' }),
        foundItems: rel.hasMany(FoundItemPost, { by: 'userId' }),
      }),
      Claim: Claim.relations({
        foundItem: rel.belongsTo(FoundItemPost, { from: 'foundItemPostId', to: 'id' }),
        claimant: rel.belongsTo(User, { from: 'claimantUserId', to: 'id' }),
      }),
      ClaimInvite: ClaimInvite.relations({
        foundItem: rel.belongsTo(FoundItemPost, { from: 'foundItemPostId', to: 'id' }),
        lostItem: rel.belongsTo(LostItemPost, { from: 'lostItemId', to: 'id' }),
        finder: rel.belongsTo(User, { from: 'finderUserId', to: 'id' }),
        owner: rel.belongsTo(User, { from: 'ownerUserId', to: 'id' }),
      }),
      Notification: Notification.relations({
        user: rel.belongsTo(User, { from: 'userId', to: 'id' }),
      }),
      LostItemPost: LostItemPost.relations({
        user: rel.belongsTo(User, { from: 'userId', to: 'id' }),
      }),
      FoundItemPost: FoundItemPost.relations({
        user: rel.belongsTo(User, { from: 'userId', to: 'id' }),
      }),
    },
  };
});
