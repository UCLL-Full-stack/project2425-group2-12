import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import Joi from 'joi';

/* --------------------- ZOD SCHEMAS ---------------------- */

// User registration validation
export const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['player', 'captain', 'admin', 'spectator']),
});

// User login validation
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

/* --------------------- ZOD MIDDLEWARE ---------------------- */

// Generic reusable Zod validator
export const validateBody = (schema: z.ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
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
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

/* --------------------- JOI VALIDATION ---------------------- */

// Joi validator for creating participations
export const validateParticipation = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    playerId: Joi.string().required().messages({
      "string.empty": "Player ID is required.",
    }),
    gameId: Joi.string().required().messages({
      "string.empty": "Game ID is required.",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Joi validator for updating participation status
export const validateParticipationStatus = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid("confirmed", "not confirmed")
      .required()
      .messages({
        "any.only": "Invalid status. Allowed values are 'confirmed' or 'not confirmed'.",
      }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
