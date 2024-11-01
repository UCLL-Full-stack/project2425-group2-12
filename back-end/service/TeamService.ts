// back-end/service/TeamService.ts

import { Team } from '../model/Team';
import { User } from '../model/User';

export class TeamService {
  private static teams: Team[] = []; // In-memory storage for simplicity

  // Initialize with dummy data
  static initializeDummyData() {
    const captain1 = new User('1', 'Alice', 'alice@example.com', 'password123', 'captain');
    const captain2 = new User('2', 'Bob', 'bob@example.com', 'password123', 'captain');

    const player1 = new User('3', 'Charlie', 'charlie@example.com', 'password123', 'player');
    const player2 = new User('4', 'Dave', 'dave@example.com', 'password123', 'player');
    const player3 = new User('5', 'Eve', 'eve@example.com', 'password123', 'player');

    const team1 = new Team('1', 'Team Alpha', captain1.user_id, [player1, player2]);
    const team2 = new Team('2', 'Team Beta', captain2.user_id, [player3]);

    this.teams.push(team1, team2);
  }

  static createTeam(name: string, captain: User): Team {
    if (this.teams.some(team => team.name === name)) {
      throw new Error('Team name must be unique');
    }
    const team = new Team(`${this.teams.length + 1}`, name, captain.user_id);
    this.teams.push(team);
    return team;
  }

  static addPlayerToTeam(teamId: string, player: User): Team {
    const team = this.teams.find(t => t.team_id === teamId);
    if (!team) throw new Error(`Team with ID ${teamId} not found`);
    team.addPlayer(player);
    return team;
  }

  static removePlayerFromTeam(teamId: string, playerId: string): Team {
    const team = this.teams.find(t => t.team_id === teamId);
    if (!team) throw new Error(`Team with ID ${teamId} not found`);
    team.removePlayer(playerId);
    return team;
  }

  static getTeamById(teamId: string): Team | undefined {
    return this.teams.find(team => team.team_id === teamId);
  }

  static getAllTeams(): Team[] {
    return this.teams;
  }

  
}

// Call to initialize dummy data at runtime
TeamService.initializeDummyData();
