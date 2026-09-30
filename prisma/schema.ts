// example
import { defineContract } from '@prisma/orm-postgres/contract-builder';
import { defineLostItemPostModel } from './models/lostItemPost.ts';
import { definePostModel } from './models/post.ts';
import { defineUserModel } from './models/user.ts';

export const contract = defineContract({}, ({ field, model, rel }) => {
  const User = defineUserModel(field, model);
  const Post = definePostModel(field, model);
  const LostItemPost = defineLostItemPostModel(field, model);

  return {
    models: {
      User: User.relations({
        posts: rel.hasMany(Post, { by: 'authorId' }),
        lostItems: rel.hasMany(LostItemPost, { by: 'userId' }),
      }),
      Post: Post.relations({
        author: rel.belongsTo(User, { from: 'authorId', to: 'id' }),
      }),
      LostItemPost: LostItemPost.relations({
        user: rel.belongsTo(User, { from: 'userId', to: 'id' }),
      }),
    },
  };
});
