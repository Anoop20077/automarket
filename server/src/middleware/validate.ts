import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        data: null,
        message: result.error.errors
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join(', '),
      });
    }
    req.body = result.data;
    next();
  };
}
