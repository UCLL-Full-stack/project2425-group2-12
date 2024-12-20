import express from "express";
import {
  getUpcomingGamesController,
  getPlayerParticipationController,
  confirmParticipationController,
  updateParticipationController,
  getTeamRosterController,
} from "../controller/participationController";
import { authorizeRoles, protect } from "../middleware/authMiddleware";
import { validateParticipation, validateParticipationStatus } from "../middleware/validationMiddleware";

/**
 * @swagger
 * /games/upcoming:
 *   get:
 *     summary: Get upcoming games
 *     description: Fetches a list of upcoming games.
 *     responses:
 *       200:
 *         description: Successfully retrieved upcoming games.
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
 *       500:
 *         description: Internal server error.
 * /games/participation/{playerId}:
 *   get:
 *     summary: Get player participation
 *     description: Retrieves participation details for a player.
 *     parameters:
 *       - in: path
 *         name: playerId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the player
 *     responses:
 *       200:
 *         description: Successfully retrieved participation data.
 *       404:
 *         description: Player not found.
 *       500:
 *         description: Internal server error.
 */

const router = express.Router();

// Fetch all upcoming games
router.get("/games/upcoming", protect, authorizeRoles('player', 'admin'), getUpcomingGamesController);

// Fetch player participation status
router.get("/games/participation/:playerId", protect, authorizeRoles('player', 'admin'), getPlayerParticipationController);

// Confirm participation
router.post("/games/participation",   validateParticipation, protect, authorizeRoles('player', 'admin'), confirmParticipationController);

// Update participation status
router.patch("/games/participation/:gameId/:playerId", validateParticipationStatus, protect, authorizeRoles('player', 'admin'), updateParticipationController);

// Fetch team roster
router.get("/games/:gameId/roster", protect, authorizeRoles('player', 'admin'), getTeamRosterController);

export default router;
