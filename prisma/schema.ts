// example
import { defineContract } from '@prisma/orm-postgres/contract-builder';
import { defineClaimModel } from './models/claim.ts';
import { definePostModel } from './models/post.ts';
import { defineUserModel } from './models/user.ts';
import { defineNotificationModel } from './models/notification.ts';

export const contract = defineContract({}, ({ field, model, rel }) => {
  const User = defineUserModel(field, model);
  const Post = definePostModel(field, model);
  const Claim = defineClaimModel(field, model);
  const Notification = defineNotificationModel(field, model);

  return {
    models: {
      User: User.relations({
        posts: rel.hasMany(Post, { by: 'authorId' }),
        claims: rel.hasMany(Claim, { by: 'claimantUserId' }),
        notifications: rel.hasMany(Notification, { by: 'userId' }),
      }),
      Post: Post.relations({
        author: rel.belongsTo(User, { from: 'authorId', to: 'id' }),
        claims: rel.hasMany(Claim, { by: 'foundItemPostId' }),
      }),
      Claim: Claim.relations({
        foundItem: rel.belongsTo(Post, { from: 'foundItemPostId', to: 'id' }),
        claimant: rel.belongsTo(User, { from: 'claimantUserId', to: 'id' }),
      }),
      Notification: Notification.relations({
        user: rel.belongsTo(User, { from: 'userId', to: 'id' }),
      }),
    },
  };
});
