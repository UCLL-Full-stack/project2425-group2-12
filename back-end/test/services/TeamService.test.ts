// back-end/test/services/TeamService.test.ts

import { TeamService } from '../../service/TeamService';
import { User } from '../../model/User';
import { Team } from '../../model/Team';

describe('TeamService', () => {
  let captain: User;
  let player: User;

  beforeEach(() => {
    // Reset teams before each test
    (TeamService as any).teams = [];
    captain = new User('1', 'Captain', 'captain@example.com', 'password123', 'captain');
    player = new User('2', 'Player', 'player@example.com', 'password123', 'player');
  });

  it('should create a new team', () => {
    const team = TeamService.createTeam('Team A', captain);
    expect(team).toBeInstanceOf(Team);
    expect(team.name).toBe('Team A');
    expect(team.captain_id).toBe(captain.user_id);
    expect(TeamService.getAllTeams()).toContainEqual(team);
  });

  it('should not allow duplicate team names', () => {
    TeamService.createTeam('Team A', captain);
    expect(() => TeamService.createTeam('Team A', captain)).toThrow('Team name must be unique');
  });

  it('should add a player to an existing team', () => {
    const team = TeamService.createTeam('Team B', captain);
    const updatedTeam = TeamService.addPlayerToTeam(team.team_id, player);
    expect(updatedTeam.players).toContainEqual(player);
  });

  it('should not add the same player twice to a team', () => {
    const team = TeamService.createTeam('Team B', captain);
    TeamService.addPlayerToTeam(team.team_id, player);
    expect(() => TeamService.addPlayerToTeam(team.team_id, player)).toThrow(
      `Player with ID ${player.user_id} is already on the team`
    );
  });

  it('should remove a player from an existing team', () => {
    const team = TeamService.createTeam('Team C', captain);
    TeamService.addPlayerToTeam(team.team_id, player);
    const updatedTeam = TeamService.removePlayerFromTeam(team.team_id, player.user_id);
    expect(updatedTeam.players).not.toContainEqual(player);
  });

  it('should throw an error if trying to add a player to a non-existent team', () => {
    expect(() => TeamService.addPlayerToTeam('nonexistent_team', player)).toThrow(
      'Team with ID nonexistent_team not found'
    );
  });

  it('should throw an error if trying to remove a player from a non-existent team', () => {
    expect(() => TeamService.removePlayerFromTeam('nonexistent_team', player.user_id)).toThrow(
      'Team with ID nonexistent_team not found'
    );
  });

  it('should get a team by ID', () => {
    const team = TeamService.createTeam('Team D', captain);
    const foundTeam = TeamService.getTeamById(team.team_id);
    expect(foundTeam).toEqual(team);
  });

  it('should return undefined for a non-existent team ID', () => {
    const foundTeam = TeamService.getTeamById('nonexistent_team');
    expect(foundTeam).toBeUndefined();
  });
});
