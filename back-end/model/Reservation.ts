// src/model/Reservation.ts
export interface Reservation {
  id: string;
  spectatorId: string; // References Spectator
  gameId: string; // References Game
  status: 'reserved' | 'cancelled';
}
