// src/service/teamService.ts
import { joinRequests, teams } from '../model/dataStore';
import { TeamEntity } from '../model/Team';
import { PlayerEntity } from '../model/Player';
import { JoinRequest } from '../types';

// Utility functions to generate IDs
function generateTeamId(): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let id = '';
  for (let i = 0; i < 3; i++) {
    id += letters[Math.floor(Math.random() * letters.length)];
  }
  return id;
}

function generatePlayerId(): string {
  return Math.floor(100 + Math.random() * 900).toString();
}

// Function to create a new team
export function createTeam(name: string): TeamEntity {
  const newTeam = new TeamEntity(generateTeamId(), name);
  teams.push(newTeam);
  return newTeam;
}


// Function to add a player to a team
export function addPlayerToTeam(
  teamId: string,
  playerName: string,
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket Keeper'
): PlayerEntity | null {
  const team = teams.find((t) => t.id === teamId);
  if (!team) {
    return null; // Team not found
  }

  const newPlayer = new PlayerEntity(
    generatePlayerId(),
    playerName,
    role,
    team.id // Include teamId
  );

  team.players.push(newPlayer);
  return newPlayer;
}


// Function to remove a player from a team
export function removePlayerFromTeam(teamId: string, playerId: string): boolean {
  const team = teams.find((t) => t.id === teamId) as TeamEntity | undefined;
  if (!team) {
    return false; // Team not found
  }

  const playerIndex = team.players.findIndex((p) => p.id === playerId);
  if (playerIndex === -1) {
    return false; // Player not found
  }

  team.players.splice(playerIndex, 1); // Remove player
  return true;
}

// Function to get all players in a team
export function getTeamPlayers(teamId: string): PlayerEntity[] | null {
  const team = teams.find((t) => t.id === teamId) as TeamEntity | undefined;
  if (!team) {
    return null; // Team not found
  }

  return team.players;
}




// Function to handle join requests
export const handleJoinRequest = (teamId: string, requestId: string, status: 'approved' | 'denied'): boolean => {
  const request = joinRequests.find((r) => r.id === requestId && r.teamId === teamId);
  if (!request || request.status !== 'pending') {
    return false; // Request not found or already handled
  }

  request.status = status;

  if (status === 'approved') {
    const team = teams.find((t) => t.id === teamId);
    if (team) {
      const newPlayer: PlayerEntity = new PlayerEntity(
        request.playerId,
        request.playerName,
        'Batsman', // Assign a default role
        teamId
      );
      team.players.push(newPlayer);
    }
  }

  return true;
};


// Function to get join requests for a team
export const getJoinRequests = (teamId: string): JoinRequest[] => {
  return joinRequests.filter((r) => r.teamId === teamId);
};
