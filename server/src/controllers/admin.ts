import { Request, Response, NextFunction } from 'express';
import * as adminService from '../services/admin';
import { sendSuccess } from '../utils/response';

export async function getStats(_req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await adminService.getStats();
    sendSuccess(res, stats, 'Stats retrieved');
  } catch (error) {
    next(error);
  }
}

export async function getPendingListings(_req: Request, res: Response, next: NextFunction) {
  try {
    const listings = await adminService.getPendingListings();
    sendSuccess(res, listings, 'Pending listings retrieved');
  } catch (error) {
    next(error);
  }
}

export async function approveListing(req: Request, res: Response, next: NextFunction) {
  try {
    const listing = await adminService.approveListing(req.params.id as string);
    sendSuccess(res, listing, 'Listing approved');
  } catch (error) {
    next(error);
  }
}

export async function rejectListing(req: Request, res: Response, next: NextFunction) {
  try {
    const listing = await adminService.rejectListing(req.params.id as string);
    sendSuccess(res, listing, 'Listing rejected');
  } catch (error) {
    next(error);
  }
}

export async function getUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await adminService.getUsers();
    sendSuccess(res, users, 'Users retrieved');
  } catch (error) {
    next(error);
  }
}

export async function toggleBan(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await adminService.toggleBan(req.params.id as string);
    sendSuccess(res, user, 'User ban status toggled');
  } catch (error) {
    next(error);
  }
}

export async function getReports(_req: Request, res: Response, next: NextFunction) {
  try {
    const reports = await adminService.getReports();
    sendSuccess(res, reports, 'Reports retrieved');
  } catch (error) {
    next(error);
  }
}
