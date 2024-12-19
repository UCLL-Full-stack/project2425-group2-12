// src/model/Game.ts
export interface Game {
  id: string;
  team1Id: string; // References Team
  team2Id: string; // References Team
  date: Date;
  time: string;
  venue: string;
}
