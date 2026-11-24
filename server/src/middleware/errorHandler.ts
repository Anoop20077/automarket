import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AppError } from '../utils/errors';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('Error:', err.message);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      data: null,
      message: err.message,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        data: null,
        message: 'A record with this value already exists',
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Record not found',
      });
    }
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      data: null,
      message: err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
    });
  }

  if (err instanceof TokenExpiredError) {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Token has expired',
    });
  }

  if (err instanceof JsonWebTokenError) {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Invalid token',
    });
  }

  return res.status(500).json({
    success: false,
    data: null,
    message: 'Internal Server Error',
  });
}
