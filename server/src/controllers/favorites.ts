import { Request, Response, NextFunction } from 'express';
import * as favoritesService from '../services/favorites';
import { sendSuccess } from '../utils/response';

export async function getFavorites(req: Request, res: Response, next: NextFunction) {
  try {
    const favorites = await favoritesService.getFavorites(req.user!.id);
    sendSuccess(res, favorites, 'Favorites retrieved');
  } catch (error) {
    next(error);
  }
}

export async function addFavorite(req: Request, res: Response, next: NextFunction) {
  try {
    const favorite = await favoritesService.addFavorite(
      req.user!.id,
      req.params.listingId as string
    );
    sendSuccess(res, favorite, 'Added to favorites', 201);
  } catch (error) {
    next(error);
  }
}

export async function removeFavorite(req: Request, res: Response, next: NextFunction) {
  try {
    await favoritesService.removeFavorite(req.user!.id, req.params.listingId as string);
    sendSuccess(res, null, 'Removed from favorites');
  } catch (error) {
    next(error);
  }
}
