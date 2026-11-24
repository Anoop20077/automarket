import { Router } from 'express';
import { z } from 'zod';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { uploadImages } from '../middleware/upload';
import * as listingsController from '../controllers/listings';

const router = Router();

const createListingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  type: z.enum(['CAR', 'BIKE']),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  price: z.number().positive('Price must be positive'),
  mileage: z.number().int().min(0, 'Mileage must be non-negative'),
  fuelType: z.enum(['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'CNG']),
  transmission: z.enum(['MANUAL', 'AUTOMATIC']),
  condition: z.enum(['NEW', 'LIKE_NEW', 'EXCELLENT', 'GOOD', 'FAIR']),
  color: z.string().min(1, 'Color is required'),
  ownerCount: z.number().int().min(1).optional(),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

const updateListingSchema = createListingSchema.partial();

// IMPORTANT: /mine must be before /:id
router.get('/', optionalAuth, listingsController.getListings);
router.get('/mine', authenticate, listingsController.getMyListings);
router.get('/:id', optionalAuth, listingsController.getListing);
router.post('/', authenticate, validate(createListingSchema), listingsController.createListing);
router.put('/:id', authenticate, validate(updateListingSchema), listingsController.updateListing);
router.delete('/:id', authenticate, listingsController.deleteListing);
router.patch('/:id/sold', authenticate, listingsController.markSold);
router.post('/:id/images', authenticate, uploadImages, listingsController.uploadListingImages);

export default router;
