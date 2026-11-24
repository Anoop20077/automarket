import { Request, Response, NextFunction } from 'express';
import * as usersService from '../services/users';
import { sendSuccess } from '../utils/response';

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await usersService.getMe(req.user!.id);
    sendSuccess(res, user, 'User profile retrieved');
  } catch (error) {
    next(error);
  }
}

export async function updateMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await usersService.updateMe(req.user!.id, req.body);
    sendSuccess(res, user, 'Profile updated');
  } catch (error) {
    next(error);
  }
}
