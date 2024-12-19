import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// Define the expected return type for team with players

type PlayerType = {
  id: string;
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket Keeper';
  teamId: string | null;
};







// Function to fetch all teams
export async function getTeams() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        players: true, // Include associated players in the team
      },
    });
    return teams;
  } catch (error: any) {
    throw new Error(`Failed to fetch teams: ${error.message}`);
  }
}

// Function to create a new team
export async function createTeam(name: string) {
  const existingTeam = await prisma.team.findUnique({
    where: { name },
  });
  if (existingTeam) {
    throw new Error(`A team with the name "${name}" already exists.`);
  }
  const newTeam = await prisma.team.create({
    data: {
      name,
    },
  });
  return newTeam;
}




// Function to add a player to a team
export async function addPlayerToTeam(
  teamId: string,
  playerName: string,
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket Keeper'
)



{
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { players: true },
  });

  if (!team) {
    throw new Error("Team not found.");
  }

  // Ensure the team doesn't exceed the maximum number of players
  if (team.players.length >= 11) {
    throw new Error("A team cannot have more than 11 players.");
  }

  // Ensure the role is valid

  const allowedRoles = ['Batsman', 'Bowler', 'All-rounder', 'Wicket Keeper'];
  if (!allowedRoles.includes(role)) {
  throw new Error('Invalid role provided.');
}

  const newPlayer = await prisma.player.create({
    data: {
      name: playerName,
      role,
      teamId,
    },
  });

  return newPlayer;
}

// Function to remove a player from a team
export async function removePlayerFromTeam(teamId: string, playerId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { players: true },
  });

  if (!team) {
    console.error(`Team not found: ${teamId}`);
    return false;
  }
  const playerExists = team.players.some((p) => p.id === playerId);
  if (!playerExists) {
    console.error(`Player not found in team ${teamId}: ${playerId}`);
    return false; // Player not found
  }

  await prisma.player.delete({
    where: { id: playerId },
  });

  return true;
}

// Function to get all players in a team
export async function getTeamPlayers(teamId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { players: true },
  });

  if (!team) {
    return null; // Team not found
  }

  return team.players;
}

// Function to update a player's role
export async function updatePlayerRole(
  teamId: string,
  playerId: string,
  newRole: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket Keeper'
) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { players: true },
  });

  if (!team) {
    throw new Error("Team not found.");
  }

  const player = team.players.find((p) => p.id === playerId);
  if (!player) {
    throw new Error("Player not found.");
  }

  const updatedPlayer = await prisma.player.update({
    where: { id: playerId },
    data: { role: newRole },
  });

  return updatedPlayer;
}
// Function to handle join requests
export async function handleJoinRequest(
  teamId: string,
  requestId: string,
  status: 'approved' | 'denied',
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket Keeper'

) {
  const request = await prisma.joinRequest.findUnique({
    where: { id: requestId },
  });

  if (!request || request.status !== 'pending' || request.teamId !== teamId) {
    return false; // Request not found or already handled
  }

  await prisma.joinRequest.update({
    where: { id: requestId },
    data: { status },
  });

  if (status === 'approved') {
    await prisma.player.create({
      data: {
        name: request.playerName,
        role, // Fix the misplaced code here
        teamId,
      },
    });
  }

  return true;
}

// Function to create a join request
export async function createJoinRequest(teamId: string, playerId: string, playerName: string) {
  try {
    console.log('Creating join request for:', { teamId, playerId, playerName });

    // Verify if the player exists
    const playerExists = await prisma.player.findUnique({
      where: { id: playerId },
    });
    if (!playerExists) {
      throw new Error(`Player with ID '${playerId}' does not exist.`);
    }

    // Verify if the team exists
    const teamExists = await prisma.team.findUnique({
      where: { id: teamId },
    });
    if (!teamExists) {
      throw new Error(`Team with ID '${teamId}' does not exist.`);
    }

    // Check for existing join request
    const existingRequest = await prisma.joinRequest.findFirst({
      where: { teamId, playerId },
    });
    if (existingRequest) {
      throw new Error(`A join request already exists for this player in the team.`);
    }

    // Proceed to create the join request
    const newRequest = await prisma.joinRequest.create({
      data: {
        teamId,
        playerId,
        playerName,
      },
    });

    console.log('Join request created:', newRequest);
    return newRequest;
  } catch (error: any) {
    console.error('Error creating join request:', error.message);
    throw error; // Rethrow for controller to handle
  }
}





// Function to get join requests for a team
export async function getJoinRequests(teamId: string) {
  const requests = await prisma.joinRequest.findMany({
    where: { teamId },
  });

  return requests;
}
