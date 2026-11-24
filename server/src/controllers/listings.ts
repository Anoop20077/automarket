import { Request, Response, NextFunction } from 'express';
import * as listingsService from '../services/listings';
import { sendSuccess, sendPaginated } from '../utils/response';

export async function getListings(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await listingsService.getListings(req.query as any);
    sendPaginated(
      res,
      result.listings,
      result.meta.total,
      result.meta.page,
      result.meta.limit,
      'Listings retrieved'
    );
  } catch (error) {
    next(error);
  }
}

export async function getListing(req: Request, res: Response, next: NextFunction) {
  try {
    const listing = await listingsService.getListing(
      req.params.id as string,
      req.user?.id
    );
    sendSuccess(res, listing, 'Listing retrieved');
  } catch (error) {
    next(error);
  }
}

export async function createListing(req: Request, res: Response, next: NextFunction) {
  try {
    const listing = await listingsService.createListing(req.body, req.user!.id);
    sendSuccess(res, listing, 'Listing created', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateListing(req: Request, res: Response, next: NextFunction) {
  try {
    const listing = await listingsService.updateListing(
      req.params.id as string,
      req.user!.id,
      req.user!.role,
      req.body
    );
    sendSuccess(res, listing, 'Listing updated');
  } catch (error) {
    next(error);
  }
}

export async function deleteListing(req: Request, res: Response, next: NextFunction) {
  try {
    await listingsService.deleteListing(
      req.params.id as string,
      req.user!.id,
      req.user!.role
    );
    sendSuccess(res, null, 'Listing deleted');
  } catch (error) {
    next(error);
  }
}

export async function markSold(req: Request, res: Response, next: NextFunction) {
  try {
    const listing = await listingsService.markSold(req.params.id as string, req.user!.id);
    sendSuccess(res, listing, 'Listing marked as sold');
  } catch (error) {
    next(error);
  }
}

export async function getMyListings(req: Request, res: Response, next: NextFunction) {
  try {
    const listings = await listingsService.getMyListings(req.user!.id);
    sendSuccess(res, listings, 'My listings retrieved');
  } catch (error) {
    next(error);
  }
}

export async function uploadListingImages(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as Express.Multer.File[];
    const images = await listingsService.uploadImages(
      req.params.id as string,
      req.user!.id,
      files
    );
    sendSuccess(res, images, 'Images uploaded', 201);
  } catch (error) {
    next(error);
  }
}
