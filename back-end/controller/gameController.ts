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
export async function createGameController(req: Request, res: Response): Promise<void> {
  const { team1Id, team2Id, date, time, venue } = req.body;

  console.log("Request Body:", req.body); // Debugging statement to log request body

  // Validate required fields
  if (!team1Id || !team2Id || !date || !time || !venue) {
    res.status(400).json({ message: "All fields (team1, team2, date, time, venue) are required." });
    return;
  }

  try {
    const newGame = await createGame(team1Id, team2Id, date, time, venue);
    res.status(201).json({
      message: "Game created successfully",
      game: newGame,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to create game",
      error: error.message,
    });
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

export async function getAllGamesController(req: Request, res: Response): Promise<void> {
  try {
    const games = await getAllGames();
    res.status(200).json({
      message: "Games retrieved successfully",
      data: games,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to retrieve games",
      error: error.message,
    });
  }
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

export async function updateGameController(req: Request, res: Response): Promise<void> {
  const { gameId } = req.params;
  const updatedData = req.body;

  try {
    const updatedGame = await updateGame(gameId, updatedData);
    if (!updatedGame) {
      res.status(404).json({
        message: "Game not found",
      });
      return;
    }

    res.status(200).json({
      message: "Game updated successfully",
      data: updatedGame,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to update game",
      error: error.message,
    });
  }
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

export async function deleteGameController(req: Request, res: Response): Promise<void> {
  const { gameId } = req.params;

  try {
    const success = await deleteGame(gameId);
    if (!success) {
      res.status(404).json({
        message: "Game not found",
      });
      return;
    }

    res.status(200).json({
      message: "Game deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to delete game",
      error: error.message,
    });
  }
}
