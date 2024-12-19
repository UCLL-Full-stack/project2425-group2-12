// src/model/Player.ts
export interface Player {
  id: string;
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket Keeper';
  teamId: string | null; // Nullable for unassigned players
}
