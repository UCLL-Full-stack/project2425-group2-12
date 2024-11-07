// src/routes/teamRoutes.ts
import express from 'express';

import { createTeamController, addPlayerController, removePlayerController, getTeamPlayersController, getTeams, updatePlayerController } from '../controller/teamController';

const router = express.Router();


router.get('/teams', getTeams); // Route to get teams


// Route to create a new team
router.post('/teams', createTeamController);

// Route to add a player to a team
router.post('/teams/:teamId/players', addPlayerController);

// Route to remove a player from a team
router.delete('/teams/:teamId/players/:playerId', removePlayerController);

// Route to get all players in a team
router.get('/teams/:teamId/players', getTeamPlayersController);

// Route to update a player's role in a team
router.patch('/teams/:teamId/players/:playerId', updatePlayerController);


export default router;
