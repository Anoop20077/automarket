import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import listingRoutes from './listings';
import favoriteRoutes from './favorites';
import chatRoutes from './chat';
import reportRoutes from './reports';
import adminRoutes from './admin';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/listings', listingRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/', chatRoutes);
router.use('/', reportRoutes);
router.use('/admin', adminRoutes);

export default router;
