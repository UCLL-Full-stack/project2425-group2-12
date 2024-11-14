import express from 'express';
import {
  createGameController,
  getAllGamesController,
  updateGameController,
  deleteGameController,
} from '../controller/gameController';

const router = express.Router();

router.post('/games', createGameController); // Route to create a game
router.get('/games', getAllGamesController); // Route to get all games
router.patch('/games/:gameId', updateGameController); // Route to update a game
router.delete('/games/:gameId', deleteGameController); // Route to delete a game

export default router;
