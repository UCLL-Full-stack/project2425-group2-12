import { PrismaClient } from '@prisma/client';
import { sendNotification } from './notificationService';

const prisma = new PrismaClient();

export async function createGame(team1Id: string, team2Id: string, date: string, time: string, venue: string) {
  // Ensure teams exist and are not the same
  if (team1Id === team2Id) {
    throw new Error("Teams in a game must be different.");
  }

  const team1 = await prisma.team.findUnique({ where: { id: team1Id } });
  const team2 = await prisma.team.findUnique({ where: { id: team2Id } });

  if (!team1 || !team2) {
    throw new Error("Both teams must exist to create a game.");
  }
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime()) || parsedDate < new Date()) {
    throw new Error("Invalid or past date provided.");
  }
  // Add time validation if necessary
const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
if (!timeRegex.test(time)) {
  throw new Error('Invalid time format. Use HH:mm.');
}

  const newGame = await prisma.game.create({
    data: {
      team1Id,
      team2Id,
      date: parsedDate, // Ensure date is in the correct format
      time,
      venue,
    },
  });

  // Notify both teams
  sendNotification({
    recipient: team1Id,
    message: `Your team is scheduled to play against ${team2Id} on ${date} at ${time} at ${venue}.`,
  });

  sendNotification({
    recipient: team2Id,
    message: `Your team is scheduled to play against ${team1Id} on ${date} at ${time} at ${venue}.`,
  });

  return newGame;
}

export async function getAllGames() {
  const games = await prisma.game.findMany({
    include: {
      team1: true, // Include team1 details
      team2: true, // Include team2 details
    },
  });
  return games;
}

export async function updateGame(gameId: string, updatedData: Partial<{ team1Id: string; team2Id: string; date: string; time: string; venue: string }>) {
  const existingGame = await prisma.game.findUnique({
    where: { id: gameId },
  });

  if (!existingGame) {
    return null; // Game not found
  }
  
  
  

  const updatedGame = await prisma.game.update({
    where: { id: gameId },
    data: {
      team1Id: updatedData.team1Id || existingGame.team1Id,
      team2Id: updatedData.team2Id || existingGame.team2Id,
      date: updatedData.date ? new Date(updatedData.date) : existingGame.date,
      time: updatedData.time || existingGame.time,
      venue: updatedData.venue || existingGame.venue,
    },
  });

  // Notify both teams about the update
  sendNotification({
    recipient: updatedGame.team1Id,
    message: `Your game against ${updatedGame.team2Id} has been updated. New schedule: ${updatedGame.date}, ${updatedGame.time}, at ${updatedGame.venue}.`,
  });

  sendNotification({
    recipient: updatedGame.team2Id,
    message: `Your game against ${updatedGame.team1Id} has been updated. New schedule: ${updatedGame.date}, ${updatedGame.time}, at ${updatedGame.venue}.`,
  });

  return updatedGame;
}

export async function deleteGame(gameId: string) {
  const existingGame = await prisma.game.findUnique({
    where: { id: gameId },
  });

  if (!existingGame) {
    return false; // Game not found
  }

  await prisma.game.delete({
    where: { id: gameId },
  });

  return true;
}
