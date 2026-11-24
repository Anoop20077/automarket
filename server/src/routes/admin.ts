import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import * as adminController from '../controllers/admin';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/stats', adminController.getStats);
router.get('/listings/pending', adminController.getPendingListings);
router.patch('/listings/:id/approve', adminController.approveListing);
router.patch('/listings/:id/reject', adminController.rejectListing);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/ban', adminController.toggleBan);
router.get('/reports', adminController.getReports);

export default router;
