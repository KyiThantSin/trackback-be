import { db } from '@/../prisma/db';
import type { Models } from '@/../prisma/schema.d';

type ClaimInviteId = Models.public_ClaimInvite['id'];

const asClaimInviteId = (id: string) => id as ClaimInviteId;

export const create = (data: {
  id: string;
  foundItemPostId: string;
  lostItemId: string;
  finderUserId: string;
  ownerUserId: string;
}) => db.orm.public.ClaimInvite.create({
  ...data,
  id: asClaimInviteId(data.id),
  foundItemPostId: data.foundItemPostId as Models.public_FoundItemPost['id'],
  lostItemId: data.lostItemId as Models.public_LostItemPost['id'],
  finderUserId: data.finderUserId as Models.public_User['id'],
  ownerUserId: data.ownerUserId as Models.public_User['id'],
});

export const findByPostPair = (foundItemPostId: string, lostItemId: string) =>
  db.orm.public.ClaimInvite.first({
    foundItemPostId: foundItemPostId as Models.public_FoundItemPost['id'],
    lostItemId: lostItemId as Models.public_LostItemPost['id'],
  });

// Invites the claimant received to claim this found item; their lost posts are
// recovered when the claim is approved, even without an algorithmic match.
export const findOpenLostItemsForClaimant = async (foundItemPostId: string, ownerUserId: string) => {
  const invites = await db.orm.public.ClaimInvite
    .include('lostItem')
    .where({
      foundItemPostId: foundItemPostId as Models.public_FoundItemPost['id'],
      ownerUserId: ownerUserId as Models.public_User['id'],
    })
    .all();

  return invites
    .map((invite) => invite.lostItem)
    .filter((lostItem) => lostItem !== null && lostItem.status === 'OPEN');
};
