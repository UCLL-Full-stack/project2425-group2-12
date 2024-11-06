// src/model/Team.ts
import { Player, PlayerEntity } from './Player';

export interface Team {
  id: string;
  name: string;
  players: PlayerEntity[];
}

export class TeamEntity implements Team {
  id: string;
  name: string;
  players: PlayerEntity[];

  constructor(id: string, name: string, players: PlayerEntity[] = []) {
    this.id = id;
    this.name = name;
    this.players = players;

    // Perform validation
    this.validate();
  }

  private validate() {
    if (!this.name) {
      throw new Error('Team name is required');
    }
  }
}
