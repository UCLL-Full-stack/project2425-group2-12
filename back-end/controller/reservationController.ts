import { Request, Response } from 'express';
import { createReservation, cancelReservation, getReservations } from '../service/reservationService';

/**
 * Retrieve all reservations.
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Retrieve all reservations
 *     responses:
 *       200:
 *         description: A list of all reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Internal server error
 */
export async function getReservationsController(req: Request, res: Response): Promise<void> {
  try {
    const reservations = await getReservations();

    if (!reservations || reservations.length === 0) {
      res.status(404).json({
        message: "No reservations found.",
      });
      return;
    }

    res.status(200).json({
      message: "Reservations fetched successfully.",
      data: reservations,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch reservations.",
      error: error.message,
    });
  }
}

/**
 * Create a new reservation.
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a new reservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               spectatorId:
 *                 type: string
 *                 description: ID of the spectator making the reservation
 *                 example: "Spectator1"
 *               gameId:
 *                 type: string
 *                 description: ID of the game to reserve
 *                 example: "Game1"
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Validation error or reservation already exists
 *       404:
 *         description: Spectator or game not found
 *       500:
 *         description: Internal server error
 */
export async function createReservationController(req: Request, res: Response): Promise<void> {
  const { gameId } = req.body;

  // Extract user ID from token (assuming JWT middleware attaches it to `req.user`)
  const spectatorId = req.user?.id;
  if (!spectatorId || !gameId) {
    res.status(400).json({ message: "Invalid request: Missing required fields." });
    return;
  }

  try {
    const newReservation = await createReservation(spectatorId, gameId, "reserved");
    res.status(201).json({ message: "Reservation created successfully.", data: newReservation });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to create reservation.", error: error.message });
  }
}


/**
 * @swagger
 * /api/reservations/{reservationId}:
 *   patch:
 *     summary: Cancel a reservation
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the reservation to cancel
 *     responses:
 *       200:
 *         description: Reservation cancelled successfully
 *       404:
 *         description: Reservation not found
 */

/**
 * Cancel a reservation.
 * @swagger
 * /api/reservations/{reservationId}:
 *   patch:
 *     summary: Cancel a reservation
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the reservation to cancel
 *     responses:
 *       200:
 *         description: Reservation cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reservation cancelled successfully."
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal server error
 */
export async function cancelReservationController(req: Request, res: Response): Promise<void> {
  const { reservationId } = req.params;

  // Validate reservationId
  if (!reservationId) {
    res.status(400).json({
      message: "Reservation ID is required.",
    });
    return;
  }

  try {
    const success = await cancelReservation(reservationId);

    if (success) {
      res.status(200).json({
        message: "Reservation cancelled successfully.",
      });
    } else {
      res.status(404).json({
        message: "Reservation not found or already cancelled.",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to cancel reservation.",
      error: error.message,
    });
  }
}