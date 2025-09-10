import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodObject } from 'zod';
import { BadRequestError } from '../errors/errors';

export const validateBody =
  (schema: ZodObject<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Request body:', req.body);

      // Validate the request body directly against the schema
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('Validation errors:', error);
        next(new BadRequestError('Validation failed'));
      } else {
        next(error);
      }
    }
  };
