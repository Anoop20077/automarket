import { PrismaClient, Prisma } from '@prisma/client';
import { NotFoundError, ForbiddenError } from '../utils/errors';

const prisma = new PrismaClient();

interface ListingQuery {
  search?: string;
  type?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  minYear?: string;
  maxYear?: string;
  fuelType?: string;
  transmission?: string;
  condition?: string;
  location?: string;
  status?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

export async function getListings(query: ListingQuery) {
  const page = parseInt(query.page || '1');
  const limit = parseInt(query.limit || '12');
  const skip = (page - 1) * limit;

  const where: Prisma.ListingWhereInput = {
    status: (query.status as any) || 'APPROVED',
  };

  if (query.search) {
    const search = query.search;
    where.OR = [
      { title: { contains: search } },
      { brand: { contains: search } },
      { model: { contains: search } },
    ];
  }

  if (query.type) {
    where.type = query.type as any;
  }

  if (query.brand) {
    where.brand = { contains: query.brand };
  }

  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) where.price.gte = parseFloat(query.minPrice);
    if (query.maxPrice) where.price.lte = parseFloat(query.maxPrice);
  }

  if (query.minYear || query.maxYear) {
    where.year = {};
    if (query.minYear) where.year.gte = parseInt(query.minYear);
    if (query.maxYear) where.year.lte = parseInt(query.maxYear);
  }

  if (query.fuelType) {
    where.fuelType = query.fuelType as any;
  }

  if (query.transmission) {
    where.transmission = query.transmission as any;
  }

  if (query.condition) {
    where.condition = query.condition as any;
  }

  if (query.location) {
    where.location = { contains: query.location };
  }

  let orderBy: Prisma.ListingOrderByWithRelationInput = { createdAt: 'desc' };
  if (query.sort) {
    switch (query.sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'year_desc':
        orderBy = { year: 'desc' };
        break;
      case 'year_asc':
        orderBy = { year: 'asc' };
        break;
      case 'mileage_asc':
        orderBy = { mileage: 'asc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }
  }

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        images: true,
        seller: {
          select: { id: true, name: true, avatar: true },
        },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  return {
    listings,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getListing(id: string, userId?: string) {
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: true,
      seller: {
        select: { id: true, name: true, phone: true, avatar: true, createdAt: true },
      },
    },
  });

  if (!listing) {
    throw new NotFoundError('Listing not found');
  }

  // Increment views
  await prisma.listing.update({
    where: { id },
    data: { views: { increment: 1 } },
  });

  let isFavorited = false;
  if (userId) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_listingId: { userId, listingId: id },
      },
    });
    isFavorited = !!favorite;
  }

  return { ...listing, isFavorited };
}

interface CreateListingData {
  title: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  condition: string;
  color: string;
  ownerCount?: number;
  location: string;
  description: string;
}

export async function createListing(data: CreateListingData, sellerId: string) {
  const listing = await prisma.listing.create({
    data: {
      ...data,
      type: data.type as any,
      fuelType: data.fuelType as any,
      transmission: data.transmission as any,
      condition: data.condition as any,
      sellerId,
    },
    include: {
      images: true,
    },
  });

  return listing;
}

export async function updateListing(
  id: string,
  userId: string,
  userRole: string,
  data: Partial<CreateListingData>
) {
  const listing = await prisma.listing.findUnique({ where: { id } });

  if (!listing) {
    throw new NotFoundError('Listing not found');
  }

  if (listing.sellerId !== userId && userRole !== 'ADMIN') {
    throw new ForbiddenError('You can only edit your own listings');
  }

  const updated = await prisma.listing.update({
    where: { id },
    data: {
      ...data,
      type: data.type as any,
      fuelType: data.fuelType as any,
      transmission: data.transmission as any,
      condition: data.condition as any,
    },
    include: { images: true },
  });

  return updated;
}

export async function deleteListing(id: string, userId: string, userRole: string) {
  const listing = await prisma.listing.findUnique({ where: { id } });

  if (!listing) {
    throw new NotFoundError('Listing not found');
  }

  if (listing.sellerId !== userId && userRole !== 'ADMIN') {
    throw new ForbiddenError('You can only delete your own listings');
  }

  await prisma.listing.delete({ where: { id } });
}

export async function markSold(id: string, userId: string) {
  const listing = await prisma.listing.findUnique({ where: { id } });

  if (!listing) {
    throw new NotFoundError('Listing not found');
  }

  if (listing.sellerId !== userId) {
    throw new ForbiddenError('You can only mark your own listings as sold');
  }

  const updated = await prisma.listing.update({
    where: { id },
    data: { status: 'SOLD' },
    include: { images: true },
  });

  return updated;
}

export async function getMyListings(userId: string) {
  const listings = await prisma.listing.findMany({
    where: { sellerId: userId },
    include: { images: true },
    orderBy: { createdAt: 'desc' },
  });

  return listings;
}

export async function uploadImages(
  listingId: string,
  userId: string,
  files: Express.Multer.File[]
) {
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });

  if (!listing) {
    throw new NotFoundError('Listing not found');
  }

  if (listing.sellerId !== userId) {
    throw new ForbiddenError('You can only upload images to your own listings');
  }

  const images = await Promise.all(
    files.map((file) =>
      prisma.listingImage.create({
        data: {
          url: '/uploads/' + file.filename,
          listingId,
        },
      })
    )
  );

  return images;
}
