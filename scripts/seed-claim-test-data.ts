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

  const existingItem = await db.orm.public.FoundItemPost.first({
    title: postTitle,
    userId: finder.id,
  });
  const foundItem = existingItem ?? await db.orm.public.FoundItemPost.create({
    title: postTitle,
    description: 'Test wallet found near the library.',
    userId: finder.id as Models.public_FoundItemPost['userId'],
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
    foundItem: {
      id: foundItem.id,
      title: foundItem.title,
      userId: foundItem.userId,
      status: foundItem.status,
    },
  }, null, 2));
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
