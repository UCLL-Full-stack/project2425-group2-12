import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['player', 'captain', 'admin', 'spectator']),
});

export const validateRegistrationWithZod = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    registrationSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        errors: error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    // Handle unexpected errors
    return res.status(500).json({ message: 'Internal server error' });
  }
};
