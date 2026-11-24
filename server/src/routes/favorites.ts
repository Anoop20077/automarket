import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as favoritesController from '../controllers/favorites';

const router = Router();

router.get('/', authenticate, favoritesController.getFavorites);
router.post('/:listingId', authenticate, favoritesController.addFavorite);
router.delete('/:listingId', authenticate, favoritesController.removeFavorite);

export default router;
