import { z } from 'zod';

// Validation schema for creating a team
export const createTeamSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Team name is required').max(50, 'Team name must be 50 characters or less'),
  }),
});

// Validation schema for adding a player
export const addPlayerSchema = z.object({
  params: z.object({
    teamId: z.string().uuid('Invalid team ID format'),
  }),
  body: z.object({
    name: z.string().min(1, 'Player name is required'),
    role: z.enum(['Batsman', 'Bowler', 'All-rounder', 'Wicket Keeper'], {
      required_error: 'Role is required',
      invalid_type_error: 'Invalid role',
    }),
  }),
});

// Validation schema for join requests
export const joinRequestSchema = z.object({
  params: z.object({
    teamId: z.string().uuid('Invalid team ID format'),
  }),
  body: z.object({
    playerId: z.string().uuid('Invalid player ID format'),
    playerName: z.string().min(1, 'Player name is required'),
  }),
});

// Add more schemas as needed for other routes
