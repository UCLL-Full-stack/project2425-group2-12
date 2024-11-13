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