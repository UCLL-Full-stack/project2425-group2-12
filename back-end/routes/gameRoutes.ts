import express from 'express';
import {
  createGameController,
  getAllGamesController,
  updateGameController,
  deleteGameController,
} from '../controller/gameController';
import { authorizeRoles, protect } from '../middleware/authMiddleware';


/**
 * @swagger
 * /games:
 *   get:
 *     summary: Get all games
 *     description: Retrieve a list of all games, including their teams, venue, and status.
 *     responses:
 *       200:
 *         description: Successfully retrieved games.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   time:
 *                     type: string
 *                   venue:
 *                     type: string
 *                   status:
 *                     type: string
 *                     example: "Scheduled"
 *       500:
 *         description: Internal server error.
 *   post:
 *     summary: Create a new game
 *     description: Adds a new game with specified teams and details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Details of the new game
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               team1Id:
 *                 type: string
 *               team2Id:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *               venue:
 *                 type: string
 *     responses:
 *       201:
 *         description: Game created successfully.
 *       401:
 *         description: Unauthorized - No token or invalid token provided.
 *       500:
 *         description: Internal server error.
 */
const router = express.Router();

router.post('/games', protect, authorizeRoles('admin'),  createGameController); // Route to create a game
router.get('/games',protect, authorizeRoles('admin', 'spectator'), getAllGamesController); // Route to get all games
router.patch('/games/:gameId',protect, authorizeRoles('admin'), updateGameController); // Route to update a game
router.delete('/games/:gameId',protect, authorizeRoles('admin'), deleteGameController); // Route to delete a game

export default router;
