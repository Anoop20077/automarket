import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as reportsController from '../controllers/reports';

const router = Router();

const reportSchema = z.object({
  reason: z.string().min(3, 'Reason must be at least 3 characters'),
  description: z.string().optional(),
});

router.post('/listings/:id/report', authenticate, validate(reportSchema), reportsController.createReport);

export default router;
