import { PrismaClient } from '@prisma/client';
import { sendNotification } from './notificationService';


const prisma = new PrismaClient();


/**
 * Fetch all upcoming games.
 */
export async function getUpcomingGames() {
  const now = new Date();
  return await prisma.game.findMany({
    where: {
      date: { gt: now },
    },
    include: {
      team1: true,
      team2: true,
    },
  });
}

/**
 * Fetch a player's participation status for upcoming games.
 */
export async function getPlayerParticipation(playerId: string) {
  return await prisma.participation.findMany({
    where: { playerId },
    include: {
      game: {
        include: { team1: true, team2: true },
      },
    },
  });
}

/**
 * Confirm a player's participation in a game.
 */
export async function confirmParticipation(playerId: string, gameId: string) {
  // Ensure game exists
  const game = await prisma.game.findUnique({
    where: { id: gameId },
  });
  if (!game) throw new Error('Game not found');

  // Ensure player exists
  const player = await prisma.player.findUnique({
    where: { id: playerId },
  });
  if (!player) throw new Error('Player not found');

  // Ensure the player belongs to one of the teams in the game
  if (player.teamId !== game.team1Id && player.teamId !== game.team2Id) {
    throw new Error('Player does not belong to any team in this game');
  }

  // Check if participation already exists
  const existingParticipation = await prisma.participation.findFirst({
    where: { playerId, gameId },
  });

  if (existingParticipation) {
    return await prisma.participation.update({
      where: { id: existingParticipation.id },
      data: { status: 'confirmed' },
    });
  }

  // Create a new participation entry
  const newParticipation = await prisma.participation.create({
    data: {
      playerId,
      gameId,
      status: 'confirmed',
    },
  });

  

  return newParticipation;
}

/**
 * Update a player's participation status.
 */
export async function updateParticipationStatus(playerId: string, gameId: string, status: 'confirmed' | 'not confirmed') {
  const participation = await prisma.participation.findFirst({
    where: { playerId, gameId },
  });

  if (!participation) throw new Error('Participation not found');

  return await prisma.participation.update({
    where: { id: participation.id },
    data: { status },
  });
}

/**
 * Fetch the team roster for a game.
 */
export async function getTeamRoster(gameId: string) {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
  });
  if (!game) throw new Error('Game not found');

  const team1Roster = await prisma.participation.findMany({
    where: {
      gameId,
      player: { teamId: game.team1Id },
    },
    include: {
      player: true,
    },
  });

  const team2Roster = await prisma.participation.findMany({
    where: {
      gameId,
      player: { teamId: game.team2Id },
    },
    include: {
      player: true,
    },
  });

  return {
    team1: team1Roster,
    team2: team2Roster,
  };
}
