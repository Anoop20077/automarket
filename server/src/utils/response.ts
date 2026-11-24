import { Response } from 'express';

export function sendSuccess(
  res: Response,
  data: any,
  message: string = 'Success',
  statusCode: number = 200
) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

export function sendError(
  res: Response,
  message: string = 'Error',
  statusCode: number = 500
) {
  return res.status(statusCode).json({
    success: false,
    data: null,
    message,
  });
}

export function sendPaginated(
  res: Response,
  data: any,
  total: number,
  page: number,
  limit: number,
  message: string = 'Success'
) {
  return res.status(200).json({
    success: true,
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    message,
  });
}
