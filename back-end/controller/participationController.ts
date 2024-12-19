import { Request, Response } from "express";
import {
  getUpcomingGames,
  getPlayerParticipation,
  confirmParticipation,
  updateParticipationStatus,
  getTeamRoster,
} from "../service/participationService";

/**
 * Fetch all upcoming games.
 * @swagger
 * /api/games/upcoming:
 *   get:
 *     summary: Retrieve all upcoming games
 *     responses:
 *       200:
 *         description: A list of all upcoming games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 *       500:
 *         description: Internal server error
 */
export async function getUpcomingGamesController(req: Request, res: Response): Promise<void> {
  try {
    const games = await getUpcomingGames();
    res.status(200).json({
      message: "Upcoming games retrieved successfully",
      data: games,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch upcoming games",
      error: error.message,
    });
  }
}

/**
 * Fetch a player's participation status.
 * @swagger
 * /api/games/participation/{playerId}:
 *   get:
 *     summary: Retrieve a player's participation status for upcoming games
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the player
 *     responses:
 *       200:
 *         description: Player participation status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Participation'
 *       404:
 *         description: No participation found for the player
 *       500:
 *         description: Internal server error
 */
export async function getPlayerParticipationController(req: Request, res: Response): Promise<void> {
  const { playerId } = req.params;

  try {
    // Validate playerId
    if (!playerId) {
      res.status(400).json({ message: "Player ID is required" });
      return;
    }

    const participation = await getPlayerParticipation(playerId);

    if (participation.length === 0) {
      res.status(404).json({
        message: `No participation data found for player with ID: ${playerId}`,
      });
      return;
    }

    res.status(200).json({
      message: "Player participation retrieved successfully",
      data: participation,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch player participation",
      error: error.message,
    });
  }
}
/**
 * Confirm participation in a game.
 * @swagger
 * /api/games/participation:
 *   post:
 *     summary: Confirm a player's participation in a game
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               playerId:
 *                 type: string
 *                 description: ID of the player
 *                 example: player123
 *               gameId:
 *                 type: string
 *                 description: ID of the game
 *                 example: game456
 *     responses:
 *       201:
 *         description: Player participation confirmed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Participation'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Player or game not found
 *       500:
 *         description: Internal server error
 */
export async function confirmParticipationController(req: Request, res: Response): Promise<void> {
  const { playerId, gameId } = req.body;

  try {
    // Validate input
    if (!playerId || !gameId) {
      res.status(400).json({
        message: "Both playerId and gameId are required.",
      });
      return;
    }

    const participation = await confirmParticipation(playerId, gameId);

    res.status(201).json({
      message: "Player participation confirmed successfully.",
      data: participation,
    });
  } catch (error: any) {
    if (error.message === "Game not found") {
      res.status(404).json({
        message: `Game with ID: ${gameId} not found.`,
      });
    } else if (error.message === "Player not found") {
      res.status(404).json({
        message: `Player with ID: ${playerId} not found.`,
      });
    } else {
      res.status(500).json({
        message: "Failed to confirm participation.",
        error: error.message,
      });
    }
  }
}

/**
 * Update participation status.
 * @swagger
 * /api/games/participation/{gameId}/{playerId}:
 *   patch:
 *     summary: Update a player's participation status in a game
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the game
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the player
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [confirmed, "not confirmed"]
 *                 description: The new status for the player's participation
 *     responses:
 *       200:
 *         description: Participation status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Participation'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Participation not found
 *       500:
 *         description: Internal server error
 */
export async function updateParticipationController(req: Request, res: Response): Promise<void> {
  const { playerId, gameId } = req.params;
  const { status } = req.body;

  try {
    // Validate input
    if (!playerId || !gameId) {
      res.status(400).json({
        message: "Both playerId and gameId are required.",
      });
      return;
    }

    if (!["confirmed", "not confirmed"].includes(status)) {
      res.status(400).json({
        message: "Invalid status. Allowed values are 'confirmed' or 'not confirmed'.",
      });
      return;
    }

    const updatedParticipation = await updateParticipationStatus(playerId, gameId, status);

    res.status(200).json({
      message: "Participation status updated successfully.",
      data: updatedParticipation,
    });
  } catch (error: any) {
    if (error.message === "Participation not found") {
      res.status(404).json({
        message: `Participation record for player ID: ${playerId} and game ID: ${gameId} not found.`,
      });
    } else {
      res.status(500).json({
        message: "Failed to update participation status.",
        error: error.message,
      });
    }
  }
}

/**
 * Fetch team roster for a game.
 * @swagger
 * /api/games/{gameId}/roster:
 *   get:
 *     summary: Retrieve team rosters for a specific game
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the game
 *     responses:
 *       200:
 *         description: Roster fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 team1:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Player'
 *                 team2:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Player'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Game or roster not found
 *       500:
 *         description: Internal server error
 */
export async function getTeamRosterController(req: Request, res: Response): Promise<void> {
  const { gameId } = req.params;

  try {
    // Validate input
    if (!gameId) {
      res.status(400).json({
        message: "gameId parameter is required.",
      });
      return;
    }

    const roster = await getTeamRoster(gameId);

    if (!roster) {
      res.status(404).json({
        message: `Roster not found for game ID: ${gameId}.`,
      });
      return;
    }

    res.status(200).json({
      message: "Team roster fetched successfully.",
      data: roster,
    });
  } catch (error: any) {
    if (error.message === "Game not found") {
      res.status(404).json({
        message: `Game with ID: ${gameId} not found.`,
      });
    } else {
      res.status(500).json({
        message: "Failed to fetch team roster.",
        error: error.message,
      });
    }
  }
}