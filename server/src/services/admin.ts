import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

export async function getStats() {
  const [
    totalUsers,
    totalListings,
    pendingListings,
    approvedListings,
    rejectedListings,
    soldListings,
    totalReports,
    pendingReports,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.listing.count(),
    prisma.listing.count({ where: { status: 'PENDING' } }),
    prisma.listing.count({ where: { status: 'APPROVED' } }),
    prisma.listing.count({ where: { status: 'REJECTED' } }),
    prisma.listing.count({ where: { status: 'SOLD' } }),
    prisma.report.count(),
    prisma.report.count({ where: { status: 'PENDING' } }),
  ]);

  return {
    totalUsers,
    totalListings,
    pendingListings,
    approvedListings,
    rejectedListings,
    soldListings,
    totalReports,
    pendingReports,
  };
}

export async function getPendingListings() {
  const listings = await prisma.listing.findMany({
    where: { status: 'PENDING' },
    include: {
      images: true,
      seller: {
        select: { id: true, name: true, email: true, avatar: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return listings;
}

export async function approveListing(id: string) {
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) {
    throw new NotFoundError('Listing not found');
  }

  const updated = await prisma.listing.update({
    where: { id },
    data: { status: 'APPROVED' },
    include: { images: true },
  });

  return updated;
}

export async function rejectListing(id: string) {
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) {
    throw new NotFoundError('Listing not found');
  }

  const updated = await prisma.listing.update({
    where: { id },
    data: { status: 'REJECTED' },
    include: { images: true },
  });

  return updated;
}

export async function getUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      avatar: true,
      role: true,
      banned: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { listings: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return users;
}

export async function toggleBan(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { banned: !user.banned },
  });

  const { password: _, ...userWithoutPassword } = updated;
  return userWithoutPassword;
}

export async function getReports() {
  const reports = await prisma.report.findMany({
    include: {
      listing: {
        select: { id: true, title: true, status: true },
      },
      user: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return reports;
}
