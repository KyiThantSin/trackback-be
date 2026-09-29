// example
import { defineContract } from '@prisma/orm-postgres/contract-builder';
import { definePostModel } from './models/post.ts';
import { defineUserModel } from './models/user.ts';

export const contract = defineContract({}, ({ field, model, rel }) => {
  const User = defineUserModel(field, model);
  const Post = definePostModel(field, model);

  return {
    models: {
      User: User.relations({
        posts: rel.hasMany(Post, { by: 'authorId' }),
      }),
      Post: Post.relations({
        author: rel.belongsTo(User, { from: 'authorId', to: 'id' }),
      }),
    },
  };
});
