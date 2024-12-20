import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

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

// Validate status for updateParticipation
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
