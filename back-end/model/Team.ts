import { User } from './User';

export class Team {
  team_id: string;
  name: string;
  captain_id: string;
  players: User[];

  constructor(team_id: string, name: string, captain_id: string, players: User[] = []) {
    if (!team_id || !name || !captain_id) {
      throw new Error("Team ID, name, and captain ID are required");
    }
    this.team_id = team_id;
    this.name = name;
    this.captain_id = captain_id;
    this.players = players;
  }

  addPlayer(player: User) {
    if (this.players.find(p => p.user_id === player.user_id)) {
      throw new Error(`Player with ID ${player.user_id} is already on the team`);
    }
    this.players.push(player);
  }

  removePlayer(playerId: string) {
    const playerIndex = this.players.findIndex(player => player.user_id === playerId);
    if (playerIndex === -1) {
      throw new Error(`Player with ID ${playerId} is not on the team`);
    }
    this.players.splice(playerIndex, 1);
  }
}
