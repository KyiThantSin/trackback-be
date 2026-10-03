import bcrypt from 'bcrypt';
import { db } from '../prisma/db.ts';
import type { Models } from '../prisma/schema.d';

const password = 'Password@123';
const finderEmail = 'finder@example.com';
const claimantEmail = 'claimant@example.com';
const postTitle = process.env.TEST_POST_TITLE ?? 'Test found wallet';

const findOrCreateUser = async (data: {
  name: string;
  email: string;
}) => {
  const existing = await db.orm.public.User.first({ email: data.email });
  if (existing) return existing;

  return db.orm.public.User.create({
    name: data.name,
    email: data.email,
    password: await bcrypt.hash(password, 10),
    role: 'user',
  });
};

const main = async () => {
  const finder = await findOrCreateUser({
    name: 'Test Finder',
    email: finderEmail,
  });
  const claimant = await findOrCreateUser({
    name: 'Test Claimant',
    email: claimantEmail,
  });

  const existingPost = await db.orm.public.Post.first({
    title: postTitle,
    authorId: finder.id,
  });
  const foundPost = existingPost ?? await db.orm.public.Post.create({
    title: postTitle,
    content: 'Test wallet found near the library.',
    authorId: finder.id as Models.public_Post['authorId'],
    category: 'wallet',
    foundLocation: 'Central Library',
    foundDate: '2026-10-03T09:00:00Z',
    photoUrl: 'https://example.com/test-wallet.jpg',
    status: 'OPEN',
  });

  console.log(JSON.stringify({
    credentials: {
      password,
      finder: { email: finderEmail, userId: finder.id },
      claimant: { email: claimantEmail, userId: claimant.id },
    },
    foundPost: {
      id: foundPost.id,
      title: foundPost.title,
      authorId: foundPost.authorId,
      status: foundPost.status,
    },
  }, null, 2));
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
