import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

export async function createReport(
  listingId: string,
  userId: string,
  data: { reason: string; description?: string }
) {
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) {
    throw new NotFoundError('Listing not found');
  }

  const report = await prisma.report.create({
    data: {
      reason: data.reason,
      description: data.description,
      listingId,
      userId,
    },
  });

  return report;
}
