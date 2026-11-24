import { PrismaClient } from '@prisma/client';
import { NotFoundError, AppError } from '../utils/errors';

const prisma = new PrismaClient();

export async function getFavorites(userId: string) {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      listing: {
        include: {
          images: true,
          seller: {
            select: { id: true, name: true, avatar: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return favorites;
}

export async function addFavorite(userId: string, listingId: string) {
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) {
    throw new NotFoundError('Listing not found');
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_listingId: { userId, listingId } },
  });

  if (existing) {
    throw new AppError('Listing already in favorites', 409);
  }

  const favorite = await prisma.favorite.create({
    data: { userId, listingId },
  });

  return favorite;
}

export async function removeFavorite(userId: string, listingId: string) {
  await prisma.favorite.delete({
    where: { userId_listingId: { userId, listingId } },
  });
}
