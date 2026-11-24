import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as usersController from '../controllers/users';

const router = Router();

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
});

router.get('/me', authenticate, usersController.getMe);
router.put('/me', authenticate, validate(updateProfileSchema), usersController.updateMe);

export default router;
