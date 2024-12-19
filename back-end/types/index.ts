// src/types/index.ts

export interface CreateTeamDTO {
  name: string;
}

export interface AddPlayerDTO {
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket Keeper';
}

export interface JoinRequest {
  id: string;
  playerId: string;
  playerName: string;
  teamId: string;
  status: 'pending' | 'approved' | 'denied';
}

export interface CreateGameDTO {
  team1Id: string; // Reference by ID
  team2Id: string; // Reference by ID
  date: string;
  time: string;
  venue: string;
}

export interface ReservationDTO {
  spectatorId: string;
  gameId: string;
  status: 'reserved' | 'cancelled';
}

export interface ParticipationDTO {
  playerId: string;
  gameId: string;
  status: 'confirmed' | 'not confirmed';
}


export interface SpectatorDTO {
  name: string;
  email?: string; // Optional, to align with the Spectator model
}
