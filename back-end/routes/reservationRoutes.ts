import express from 'express';
import { createReservationController, cancelReservationController, getReservationsController } from '../controller/reservationController';
import { authorizeRoles, protect } from '../middleware/authMiddleware';

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Get all reservations
 *     description: Retrieve a list of all reservations for games.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved reservations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   spectatorId:
 *                     type: string
 *                   gameId:
 *                     type: string
 *                   status:
 *                     type: string
 *       401:
 *         description: Unauthorized - No token or invalid token provided.
 *       500:
 *         description: Internal server error.
 *   post:
 *     summary: Create a reservation
 *     description: Create a reservation for a game.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Reservation details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               spectatorId:
 *                 type: string
 *               gameId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reservation created successfully.
 *       401:
 *         description: Unauthorized - No token or invalid token provided.
 *       500:
 *         description: Internal server error.
 */

const router = express.Router();

// Fetch all reservations (for testing or admin view)
router.get('/reservations',protect, authorizeRoles('admin', 'spectator'), getReservationsController);

// Create a new reservation
router.post('/reservations',protect, authorizeRoles('admin', 'spectator'), createReservationController);

// Cancel a reservation
router.delete('/reservations/:reservationId',protect, authorizeRoles('admin', 'spectator'), cancelReservationController);

export default router;
