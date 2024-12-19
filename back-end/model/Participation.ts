// src/model/Participation.ts
export interface Participation {
  id: string;
  playerId: string; // References Player
  gameId: string; // References Game
  status: 'confirmed' | 'not confirmed';
}
