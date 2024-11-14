import { Request, Response } from 'express';
import { createGame, getAllGames, updateGame, deleteGame } from '../service/gameService';


/**
 * @swagger
 * /api/games:
 *   post:
 *     summary: Create a new game
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               team1:
 *                 type: string
 *                 description: Name of the first team
 *                 example: Team A
 *               team2:
 *                 type: string
 *                 description: Name of the second team
 *                 example: Team B
 *               date:
 *                 type: string
 *                 description: Date of the game (YYYY-MM-DD)
 *                 example: 2024-11-23
 *               time:
 *                 type: string
 *                 description: Time of the game (HH:mm)
 *                 example: 19:30
 *               venue:
 *                 type: string
 *                 description: Venue of the game
 *                 example: Chepauk, Chennai
 *     responses:
 *       201:
 *         description: Game created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: Validation error
 */
export function createGameController(req: Request, res: Response): void {
  const { team1, team2, date, time, venue } = req.body;

  try {
    const newGame = createGame(team1, team2, date, time, venue);
    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({ message: "Can not Create Team" });
  }
}


/**
 * @swagger
 * /api/games:
 *   get:
 *     summary: Retrieve all games
 *     responses:
 *       200:
 *         description: A list of all games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 */

export function getAllGamesController(req: Request, res: Response): void {
  const games = getAllGames();
  res.status(200).json(games);
}



/**
 * @swagger
 * /api/games/{gameId}:
 *   patch:
 *     summary: Update an existing game
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the game to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               team1:
 *                 type: string
 *                 description: Name of the first team
 *               team2:
 *                 type: string
 *                 description: Name of the second team
 *               date:
 *                 type: string
 *                 description: Date of the game (YYYY-MM-DD)
 *               time:
 *                 type: string
 *                 description: Time of the game (HH:mm)
 *               venue:
 *                 type: string
 *                 description: Venue of the game
 *     responses:
 *       200:
 *         description: Game updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Game not found
 */

export function updateGameController(req: Request, res: Response): void {
  const { gameId } = req.params;
  const updatedData = req.body;

  const updatedGame = updateGame(gameId, updatedData);
  if (!updatedGame) {
    res.status(404).json({ message: 'Game not found' });
    return;
  }

  res.status(200).json(updatedGame);
}

/**
 * @swagger
 * /api/games/{gameId}:
 *   delete:
 *     summary: Delete a game
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the game to delete
 *     responses:
 *       200:
 *         description: Game deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game deleted successfully
 *       404:
 *         description: Game not found
 */

export function deleteGameController(req: Request, res: Response): void {
  const { gameId } = req.params;

  const success = deleteGame(gameId);
  if (!success) {
    res.status(404).json({ message: 'Game not found' });
    return;
  }

  res.status(200).json({ message: 'Game deleted successfully' });
}
