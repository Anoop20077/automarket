import { Request, Response, NextFunction } from 'express';
import * as reportsService from '../services/reports';
import { sendSuccess } from '../utils/response';

export async function createReport(req: Request, res: Response, next: NextFunction) {
  try {
    const report = await reportsService.createReport(
      req.params.id as string,
      req.user!.id,
      req.body
    );
    sendSuccess(res, report, 'Report submitted', 201);
  } catch (error) {
    next(error);
  }
}
