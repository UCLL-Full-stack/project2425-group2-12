import { PrismaClient } from '@prisma/client';
import { sendNotification } from './notificationService';

const prisma = new PrismaClient();


/**
 * Get all reservations
 */
export async function getReservations() {
  return await prisma.reservation.findMany({
    include: {
      game: {
        include: {
          team1: true,
          team2: true,
        },
      },
      spectator: true,
    },
  });
}

/**
 * Create a reservation
 */
export async function createReservation(spectatorId: string, gameId: string, status: 'reserved' | 'cancelled') {
  if (!['reserved', 'cancelled'].includes(status)) {
    throw new Error('Invalid status. Allowed values are "reserved" or "cancelled".');
  }

  

  const spectator = await prisma.spectator.findUnique({
    where: { id: spectatorId },
  });
  if (!spectator) {
    throw new Error('Spectator not found');
  }

  const game = await prisma.game.findUnique({
    where: { id: gameId },
  });
  if (!game) {
    throw new Error('Game not found');
  }

  const existingReservation = await prisma.reservation.findFirst({
    where: {
      spectatorId,
      gameId,
      status: 'reserved',
    },
  });
  if (existingReservation) {
    throw new Error('Reservation already exists for this game');
  }

  return await prisma.reservation.create({
    data: {
      spectatorId,
      gameId,
      status,
    },
  });
}
/**
 * Cancel a reservation
 */
export async function cancelReservation(reservationId: string): Promise<boolean> {
  // Find the reservation
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { game: true },
  });
  if (!reservation || reservation.status === 'cancelled') {
    return false; // Reservation not found or already cancelled
  }

  // Update reservation status to 'cancelled'
  await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: 'cancelled' },
  });

  // Notify the spectator
  sendNotification({
    recipient: reservation.spectatorId,
    message: `Your reservation for the game ${reservation.gameId} has been cancelled.`,
  });

  return true;
}
