import { Router } from 'express';
import { TeamController } from '../controller/teamController';
import { body, param } from 'express-validator';
import validateRequest from '../middleware/validateRequest'; // Custom middleware to handle validation results

const router = Router();

// Route to create a new team with validation
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Team name is required'),
    body('captain.user_id').notEmpty().withMessage('Captain ID is required'),
    body('captain.role').isIn(['captain', 'player']).withMessage('Role must be either captain or player'),
  ],
  validateRequest,
  TeamController.createTeam
);

// Route to get details of a specific team
router.get(
  '/:id',
  [
    param('id').isString().withMessage('Team ID must be a string'),
    validateRequest,
  ],
  TeamController.getTeamDetails
);

router.get('/', TeamController.getAllTeams);  // Ensure this matches what you need
router.get('/:id', TeamController.getTeamDetails);



// Route to add a player to a team with validation
router.post(
  '/:id/players',
  [
    param('id').notEmpty().withMessage('Team ID is required'),
    body('player.user_id').notEmpty().withMessage('Player ID is required'),
    body('player.role').isIn(['captain', 'player']).withMessage('Role must be either captain or player'),
    validateRequest,
  ],
  TeamController.addPlayerToTeam
);

// Route to remove a player from a team with validation
router.delete(
  '/:id/players/:playerId',
  [
    param('id').notEmpty().withMessage('Team ID is required'),
    param('playerId').notEmpty().withMessage('Player ID is required'),
    validateRequest,
  ],
  TeamController.removePlayerFromTeam
);

export default router;
